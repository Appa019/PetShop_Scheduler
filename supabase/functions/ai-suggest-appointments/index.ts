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
    const method = req.method;

    // GET /ai-suggest-appointments?pet_id={id} — fetch existing appointments as suggestions
    if (method === "GET") {
      const url = new URL(req.url);
      const petId = url.searchParams.get("pet_id");
      if (!petId) {
        return new Response(JSON.stringify({ detail: "Missing pet_id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify pet ownership
      const { data: pet } = await supabase
        .from("pets")
        .select("id")
        .eq("id", parseInt(petId))
        .eq("owner_id", user.id)
        .single();

      if (!pet) {
        return new Response(JSON.stringify({ detail: "Pet not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const now = new Date().toISOString();
      const { data: upcoming } = await supabase
        .from("appointments")
        .select("*")
        .eq("pet_id", parseInt(petId))
        .eq("user_id", user.id)
        .gt("date_time", now)
        .order("date_time", { ascending: true })
        .limit(10);

      const appointments = (upcoming || []).map((appt: Record<string, unknown>) => {
        const nowMs = Date.now();
        const apptMs = new Date(appt.date_time as string).getTime();
        const intervalDays = Math.max(1, Math.round((apptMs - nowMs) / (1000 * 60 * 60 * 24)));
        const notes = (appt.notes as string) || "";

        const match = notes.match(/^\[(\w+)\]\s+(.+?)\s+-\s+(.+)$/);
        let priority = "medium", type = notes || "Consulta", reason = "";
        if (match) {
          priority = match[1].toLowerCase();
          type = match[2];
          reason = match[3];
        }

        return { type, interval_days: intervalDays, priority, reason };
      });

      return new Response(
        JSON.stringify({
          appointments,
          next_recommended: appointments[0]?.type || "",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /ai-suggest-appointments — generate AI suggestions and create appointments
    if (method === "POST") {
      const body = await req.json();
      const { pet_id, symptoms, breed_override } = body;

      if (!pet_id) {
        return new Response(JSON.stringify({ detail: "Missing pet_id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: pet } = await supabase
        .from("pets")
        .select("*")
        .eq("id", pet_id)
        .eq("owner_id", user.id)
        .single();

      if (!pet) {
        return new Response(JSON.stringify({ detail: "Pet not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const breed = breed_override || pet.ai_breed || "Unknown";

      let prompt = `
    Você é um veterinário especialista em medicina preventiva e bem-estar animal no Brasil.
    Sua tarefa é criar um CRONOGRAMA VETERINÁRIO COMPLETO de 5 anos para o pet abaixo.

    DADOS DO PET:
    - Nome: ${pet.name}
    - Raça: ${breed}
    - Idade atual: ${pet.age}
    - Porte: ${pet.size || "Não informado"}
    - Peso aproximado: ${pet.weight || "Não informado"}`;

      if (symptoms && symptoms.length > 0) {
        prompt += `
    - Sintomas/Condições Relatados: ${symptoms.join(", ")}
    ⚠️ URGENTE: Os sintomas acima requerem atenção IMEDIATA. Inclua consultas urgentes nos primeiros dias.`;
      }

      prompt += `

    INSTRUÇÕES:
    1. Gere entre 25 e 35 consultas/exames cobrindo os próximos 5 anos (até 1825 dias)
    2. Use nomes ESPECÍFICOS em português
    3. Inclua vermifugações, vacinas, dental, higiene (banho, tosa, corte de unhas, limpeza de ouvidos)
    4. Calibre para a fase de vida atual
    5. Inclua exames específicos para a raça

    Retorne EXCLUSIVAMENTE como JSON:
    {
      "appointments": [
        {
          "type": "Nome da consulta/exame",
          "interval_days": 30,
          "priority": "high",
          "reason": "Justificativa clínica"
        }
      ],
      "next_recommended": "Nome da consulta mais urgente"
    }

    Prioridades: "high" (urgente), "medium" (preventivo), "low" (eletivo/bem-estar)`;

      const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-5.2",
          reasoning: { effort: "high" },
          input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }],
          text: {
            format: {
              type: "json_schema",
              name: "appointment_schedule",
              schema: {
                type: "object",
                properties: {
                  appointments: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string" },
                        interval_days: { type: "integer" },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                        reason: { type: "string" },
                      },
                      required: ["type", "interval_days", "priority", "reason"],
                      additionalProperties: false,
                    },
                  },
                  next_recommended: { type: "string" },
                },
                required: ["appointments", "next_recommended"],
                additionalProperties: false,
              },
              strict: true,
            },
          },
        }),
      });

      let suggestions;
      if (openaiResponse.ok) {
        const data = await openaiResponse.json();
        const rawText = data.output?.find((o: any) => o.type === "message")?.content?.[0]?.text
          || data.output?.[0]?.content?.[0]?.text
          || data.output_text
          || "{}";
        suggestions = JSON.parse(rawText);
      } else {
        const errBody = await openaiResponse.text();
        console.error("OpenAI error:", openaiResponse.status, errBody);
        return new Response(
          JSON.stringify({ detail: `OpenAI API error: ${openaiResponse.status}`, debug: errBody }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create appointments in DB
      const now = Date.now();
      const apptInserts = (suggestions.appointments || []).map(
        (appt: { type: string; interval_days: number; priority: string; reason: string }) => {
          const apptDate = new Date(now + appt.interval_days * 24 * 60 * 60 * 1000);
          const priority = (appt.priority || "medium").toUpperCase();
          const notes = `[${priority}] ${appt.type} - ${appt.reason}`;
          return {
            date_time: apptDate.toISOString(),
            notes,
            user_id: user.id,
            pet_id: pet.id,
          };
        }
      );

      if (apptInserts.length > 0) {
        await supabase.from("appointments").insert(apptInserts);
      }

      return new Response(JSON.stringify(suggestions), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ detail: "Method not allowed" }), {
      status: 405,
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
