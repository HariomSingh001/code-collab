import { createClient } from "@supabase/supabase-js";
import { ENV } from "../lib/env.js";
import User from "../models/User.js";

const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

export const protectRoute = [
  async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - no token provided" });
      }

      const token = authHeader.split(" ")[1];
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

      if (error || !supabaseUser) {
        return res.status(401).json({ message: "Unauthorized - invalid token" });
      }

      const supabaseId = supabaseUser.id;

      if (!supabaseId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // find user in db by supabase ID
      const user = await User.findOne({ supabaseId });

      if (!user) return res.status(404).json({ message: "User not found" });

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
