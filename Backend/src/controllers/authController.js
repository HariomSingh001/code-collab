import { createClient } from "@supabase/supabase-js";
import { ENV } from "../lib/env.js";
import User from "../models/User.js";

const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

export async function syncUser(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

    if (error || !supabaseUser) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { id, email } = supabaseUser;
    let user = await User.findOne({ supabaseId: id });

    if (!user) {
      user = await User.create({
        supabaseId: id,
        email,
        name: email?.split("@")[0] || "Anonymous",
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in syncUser controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
