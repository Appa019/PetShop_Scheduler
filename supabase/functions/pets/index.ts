import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { getSupabaseClient } from "../_shared/supabase.ts";
import { getUser } from "../_shared/auth.ts";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await getUser(req);
    const supabase = getSupabaseClient(req);
    const url = new URL(req.url);
    const method = req.method;

    // GET /pets — list user's pets
    if (method === "GET") {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /pets — create pet
    if (method === "POST") {
      const body = await req.json();
      const { name, age, basic_info, size, weight, photo_url,
        ai_breed, ai_care_script, ai_suggested_symptoms, ai_breed_diseases } = body;

      const { data, error } = await supabase
        .from("pets")
        .insert({
          name,
          age,
          basic_info,
          size: size || "",
          weight: weight || "",
          photo_url: photo_url || "",
          ai_breed: ai_breed || "",
          ai_care_script: ai_care_script || "",
          ai_suggested_symptoms: ai_suggested_symptoms || "[]",
          ai_breed_diseases: ai_breed_diseases || "",
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE /pets?id={id} — delete pet (cascade handled by FK)
    if (method === "DELETE") {
      const petId = url.searchParams.get("id");
      if (!petId) {
        return new Response(JSON.stringify({ detail: "Missing pet id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify ownership
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

      // Delete associated appointments first
      await supabase
        .from("appointments")
        .delete()
        .eq("pet_id", parseInt(petId));

      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", parseInt(petId))
        .eq("owner_id", user.id);

      if (error) throw error;
      return new Response(null, { status: 204, headers: corsHeaders });
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
