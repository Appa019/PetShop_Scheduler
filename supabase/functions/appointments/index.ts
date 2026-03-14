import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { getSupabaseClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";
import { sendAppointmentEmail } from "../_shared/email.ts";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await getUser(req);
    const supabase = getSupabaseClient(req);
    const method = req.method;

    // GET /appointments — list user's appointments with pet details
    if (method === "GET") {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id, date_time, notes, pet_id, user_id,
          pets ( name, ai_breed )
        `)
        .eq("user_id", user.id)
        .order("date_time", { ascending: true });

      if (error) throw error;

      // Flatten pet data into response
      const formatted = (data || []).map((app: Record<string, unknown>) => {
        const pet = app.pets as Record<string, string> | null;
        return {
          id: app.id,
          date_time: app.date_time,
          notes: app.notes,
          pet_id: app.pet_id,
          user_id: app.user_id,
          pet_name: pet?.name || null,
          pet_breed: pet?.ai_breed || null,
        };
      });

      return new Response(JSON.stringify(formatted), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /appointments — create appointment + send confirmation email
    if (method === "POST") {
      const body = await req.json();
      const { date_time, notes, pet_id } = body;

      // Verify pet belongs to user
      const { data: pet } = await supabase
        .from("pets")
        .select("id, name")
        .eq("id", pet_id)
        .eq("owner_id", user.id)
        .single();

      if (!pet) {
        return new Response(JSON.stringify({ detail: "Pet not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("appointments")
        .insert({ date_time, notes, user_id: user.id, pet_id })
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email (non-blocking)
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, email")
          .eq("id", user.id)
          .single();

        if (profile) {
          const dt = new Date(date_time);
          const formatted = dt.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) + " às " + dt.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          await sendAppointmentEmail(
            profile.email,
            profile.name,
            pet.name,
            formatted
          );
        }
      } catch (emailErr) {
        console.warn("Could not send appointment email:", emailErr);
      }

      return new Response(JSON.stringify(data), {
        status: 201,
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
