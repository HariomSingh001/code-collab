import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env.js";

if (!ENV.SUPABASE_URL || !ENV.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
}

// Service role client — bypasses RLS, used for server-side operations
export const supabase = createClient(
  ENV.SUPABASE_URL || "",
  ENV.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Anon client — respects RLS, used for verifying user tokens
export const supabaseAnon = createClient(
  ENV.SUPABASE_URL || "",
  ENV.SUPABASE_ANON_KEY || ""
);

export const testConnection = async () => {
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error) {
      // Table might not exist yet, that's ok — connection itself works
      if (error.code === "42P01") {
        console.log("Supabase connected (tables not yet created — run the schema SQL)");
        return;
      }
      throw error;
    }
    console.log("Connected to Supabase PostgreSQL");
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
  }
};

export default supabase;
