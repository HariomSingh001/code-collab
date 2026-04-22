import { supabase, supabaseAnon } from "../lib/db.js";

export async function syncUser(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user: supabaseUser },
      error,
    } = await supabaseAnon.auth.getUser(token);

    if (error || !supabaseUser) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { id, email } = supabaseUser;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("supabase_id", id)
      .single();

    if (existingUser) {
      return res.status(200).json({ user: existingUser });
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        supabase_id: id,
        email,
        name: email?.split("@")[0] || "Anonymous",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(200).json({ user: newUser });
  } catch (error) {
    console.log("Error in syncUser controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
