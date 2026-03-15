import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { getSupabaseClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await getUser(req);
    const supabase = getSupabaseClient(req);
    const body = await req.json();
    const { pet_id } = body;

    if (!pet_id) {
      return new Response(JSON.stringify({ detail: "Missing pet_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch pet from DB
    const { data: pet } = await supabase
      .from("pets")
      .select("id, photo_url, size, weight")
      .eq("id", pet_id)
      .eq("owner_id", user.id)
      .single();

    if (!pet) {
      return new Response(JSON.stringify({ detail: "Pet not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!pet.photo_url || !pet.photo_url.includes(",")) {
      return new Response(JSON.stringify({ detail: "No photo available" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const imageBase64 = pet.photo_url.split(",")[1];

    const prompt = `
    Você é um especialista em identificação de raças animais com décadas de experiência.

    Este pet é um SRD (Sem Raça Definida / mestiço) — não tem raça pura conhecida.
    Porte: ${pet.size || "Não informado"}
    Peso aproximado: ${pet.weight || "Não informado"}

    Analise a imagem com máxima atenção e identifique a composição racial mais provável:

    CRITÉRIOS DE ANÁLISE:
    1. Formato e tamanho da cabeça (crânio, focinho, orelhas)
    2. Tipo e textura do pelo (liso, ondulado, crespo, fio, dupla camada)
    3. Estrutura corporal (proporções, dorso, membros, cauda)
    4. Padrão de cores e marcações (tricolor, merle, manchas, máscara)
    5. Porte e peso (use os dados fornecidos para validar)

    RETORNE:
    - Até 5 raças MAIS PROVÁVEIS ordenadas por dominância visual
    - Breve justificativa no campo "evidence"

    Retorne EXCLUSIVAMENTE como JSON:
    {
      "breed": "SRD - Raça1 x Raça2 x Raça3",
      "evidence": "Breve justificativa"
    }

    Sempre inicie com "SRD - " seguido da mistura de raças.`;

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.2",
        reasoning: { effort: "medium" },
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: prompt },
              {
                type: "input_image",
                image_url: `data:image/jpeg;base64,${imageBase64}`,
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "breed_mix",
            schema: {
              type: "object",
              properties: {
                breed: { type: "string" },
                evidence: { type: "string" },
              },
              required: ["breed", "evidence"],
              additionalProperties: false,
            },
            strict: true,
          },
        },
      }),
    });

    let breed = "SRD - Raça não determinada";
    if (openaiResponse.ok) {
      const data = await openaiResponse.json();
      const rawText = data.output?.find((o: any) => o.type === "message")?.content?.[0]?.text
        || data.output?.[0]?.content?.[0]?.text
        || data.output_text
        || "{}";
      const result = JSON.parse(rawText);
      breed = result.breed || breed;
    } else {
      const errBody = await openaiResponse.text();
      console.error("OpenAI error:", openaiResponse.status, errBody);
      return new Response(
        JSON.stringify({ detail: `OpenAI API error: ${openaiResponse.status}`, debug: errBody }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update pet breed in DB
    await supabase
      .from("pets")
      .update({ ai_breed: breed })
      .eq("id", pet_id)
      .eq("owner_id", user.id);

    return new Response(JSON.stringify({ breed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error";
    const status = message.includes("Authorization") ? 401 : 500;
    return new Response(JSON.stringify({ detail: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
