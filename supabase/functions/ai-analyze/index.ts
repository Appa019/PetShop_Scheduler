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

    const { pet_name, pet_age, basic_info, pet_size, pet_weight, photo_base64, pet_id } = body;

    // If pet_id provided, fetch photo from DB
    let imageBase64 = photo_base64 || "";
    if (pet_id && !imageBase64) {
      const { data: pet } = await supabase
        .from("pets")
        .select("photo_url")
        .eq("id", pet_id)
        .eq("owner_id", user.id)
        .single();

      if (pet?.photo_url?.includes(",")) {
        imageBase64 = pet.photo_url.split(",")[1];
      }
    }

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ detail: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `
    Você é um veterinário especialista de alto nível da clínica '8Patas' no Brasil.
    Sua análise será usada diretamente como guia de saúde para o tutor do pet.
    Portanto, seja PRECISO, COMPLETO e PROFISSIONAL em todas as respostas.

    Informações do pet:
    - Nome: ${pet_name}
    - Idade: ${pet_age}
    - Porte: ${pet_size || "Não informado"}
    - Peso aproximado: ${pet_weight || "Não informado"}
    - Informações adicionais / Problemas de saúde relatados: ${basic_info || "Nenhum"}

    Analise a imagem fornecida em conjunto com todas as informações acima e execute as 4 tarefas a seguir:

    TAREFA 1 — IDENTIFICAÇÃO DA RAÇA
    Identifique a raça provável (ou mistura de raças) usando características visuais, porte, peso e toda informação disponível.
    - Se for RAÇA PURA: retorne somente o nome da raça em português.
    - Se for MESTIÇO / SRD: retorne "SRD" seguido de até 5 raças prováveis ordenadas por dominância visual, separadas por " x ".
      Formato: "SRD - Raça1 x Raça2 x Raça3" (máximo 5 raças).
    - Se não for cão/gato, identifique a espécie e raça do animal com precisão.
    - Use porte e peso para refinar.

    TAREFA 2 — SCRIPT DE CUIDADOS PERSONALIZADO (em Português Brasil)
    Gere um script de cuidados ESPECÍFICO para a raça/mistura identificada, considerando a idade atual (${pet_age}) e a fase de vida do pet.
    Inclua obrigatoriamente: dieta, exercícios, marcos preventivos, alertas de saúde.
    Formato: bullet points em português. Mínimo 8 pontos, máximo 15.

    TAREFA 3 — CONDIÇÕES DE SAÚDE A MONITORAR (lista de objetos JSON)
    Liste de 6 a 10 condições/doenças às quais esta raça tem PREDISPOSIÇÃO GENÉTICA.
    Para cada: "name" (nome técnico em português) e "description" (1-2 frases para o tutor).

    TAREFA 4 — PERFIL DE DOENÇAS DA RAÇA (texto narrativo em Português Brasil)
    Escreva um perfil médico DETALHADO e NARRATIVO das principais doenças genéticas desta raça/mistura.
    Mínimo 3, máximo 5 doenças. Parágrafos corridos, sem bullet points.

    Retorne EXCLUSIVAMENTE como JSON:
    {
      "breed": "Raça identificada",
      "care_script": "- Ponto 1\\n- Ponto 2\\n...",
      "suggested_symptoms": [{"name": "...", "description": "..."}],
      "breed_diseases": "Parágrafo 1...\\n\\nParágrafo 2..."
    }`;

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.2",
        reasoning: { effort: "high" },
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
            name: "pet_analysis",
            schema: {
              type: "object",
              properties: {
                breed: { type: "string" },
                care_script: { type: "string" },
                suggested_symptoms: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                    },
                    required: ["name", "description"],
                    additionalProperties: false,
                  },
                },
                breed_diseases: { type: "string" },
              },
              required: ["breed", "care_script", "suggested_symptoms", "breed_diseases"],
              additionalProperties: false,
            },
            strict: true,
          },
        },
      }),
    });

    let aiResult;
    if (openaiResponse.ok) {
      const data = await openaiResponse.json();
      aiResult = JSON.parse(data.output?.[0]?.content?.[0]?.text || data.output_text || "{}");
    } else {
      console.error("OpenAI error:", await openaiResponse.text());
      aiResult = {
        breed: "Desconhecida",
        care_script: "- Forneça uma dieta balanceada.\n- Garanta exercícios diários.\n- Visite o veterinário regularmente.",
        suggested_symptoms: [
          { name: "Apatia", description: "Seu pet parece sem energia ou menos animado que o normal." },
          { name: "Vômito", description: "Episódios frequentes merecem atenção veterinária." },
          { name: "Diarreia", description: "Fezes líquidas por mais de 24h exigem avaliação." },
          { name: "Falta de Apetite", description: "Recusa em comer por mais de 1 dia pode indicar dor ou doença." },
          { name: "Coceira Excessiva", description: "Pode indicar alergia ou parasitas." },
        ],
        breed_diseases: "Não foi possível gerar o perfil de doenças. Consulte um veterinário.",
      };
    }

    // If pet_id provided, update the pet record with AI results
    if (pet_id) {
      await supabase
        .from("pets")
        .update({
          ai_breed: aiResult.breed,
          ai_care_script: aiResult.care_script,
          ai_suggested_symptoms: JSON.stringify(aiResult.suggested_symptoms),
          ai_breed_diseases: aiResult.breed_diseases,
        })
        .eq("id", pet_id)
        .eq("owner_id", user.id);
    }

    return new Response(JSON.stringify(aiResult), {
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
