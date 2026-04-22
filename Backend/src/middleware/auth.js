import { supabase, supabaseAnon } from "../lib/db.js";

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - no token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the JWT with Supabase
    const {
      data: { user: supabaseUser },
      error,
    } = await supabaseAnon.auth.getUser(token);

    if (error || !supabaseUser) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }

    // Find user in our users table
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("supabase_id", supabaseUser.id)
      .single();

    // Self-heal: auto-create the users row if this Supabase user doesn't have one yet
    if (!user) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          supabase_id: supabaseUser.id,
          email: supabaseUser.email,
          name:
            supabaseUser.user_metadata?.name ||
            supabaseUser.email?.split("@")[0] ||
            "Anonymous",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Auto-create user failed:", insertError);
        return res.status(500).json({
          message: "Failed to provision user account",
          error: insertError.message,
        });
      }

      user = newUser;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
