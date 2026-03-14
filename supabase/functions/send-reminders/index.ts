import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabase.ts";
import { sendReminderEmail } from "../_shared/email.ts";

// Called by pg_cron daily at 08:00 BRT (11:00 UTC)
// Sends reminder emails for appointments scheduled for tomorrow
Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Calculate tomorrow's date range (UTC)
    const now = new Date();
    const tomorrowStart = new Date(now);
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);
    tomorrowStart.setUTCHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setUTCHours(23, 59, 59, 999);

    // Fetch tomorrow's appointments with user and pet data
    const { data: appointments, error } = await supabaseAdmin
      .from("appointments")
      .select(`
        id, date_time, notes, user_id, pet_id,
        profiles!appointments_user_id_fkey ( name, email ),
        pets!appointments_pet_id_fkey ( name )
      `)
      .gte("date_time", tomorrowStart.toISOString())
      .lte("date_time", tomorrowEnd.toISOString());

    if (error) throw error;

    console.log(`[send-reminders] ${(appointments || []).length} appointment(s) tomorrow`);

    let sent = 0;
    let failed = 0;

    for (const appt of appointments || []) {
      const profile = appt.profiles as Record<string, string> | null;
      const pet = appt.pets as Record<string, string> | null;

      if (!profile || !pet) continue;

      const dt = new Date(appt.date_time as string);
      const formatted = dt.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) + " às " + dt.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const ok = await sendReminderEmail(
        profile.email,
        profile.name,
        pet.name,
        formatted
      );

      if (ok) {
        sent++;
        console.log(`  ✅ Reminder → ${profile.email} (pet: ${pet.name})`);
      } else {
        failed++;
        console.log(`  ❌ Failed → ${profile.email} (pet: ${pet.name})`);
      }
    }

    return new Response(
      JSON.stringify({ total: (appointments || []).length, sent, failed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error";
    console.error("[send-reminders] Error:", message);
    return new Response(JSON.stringify({ detail: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
