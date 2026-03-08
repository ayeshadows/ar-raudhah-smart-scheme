import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { application_id, donation_amount } = await req.json();

    if (!application_id || !donation_amount) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const statuses = ["under_review", "payment_verified", "approved"];

    for (const status of statuses) {
      await sleep(5000);
      await supabase
        .from("applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", application_id);
    }

    // Get the application to find user_id
    const { data: app } = await supabase
      .from("applications")
      .select("user_id")
      .eq("id", application_id)
      .single();

    if (app) {
      // Create the first transaction matching the donation amount
      await supabase.from("transactions").insert({
        user_id: app.user_id,
        application_id,
        amount: donation_amount,
        type: "payment",
        status: "completed",
        description: "Monthly donation payment",
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
