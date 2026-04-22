import { supabase } from "../lib/db.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user.id;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const { data: session, error } = await supabase
      .from("sessions")
      .insert({ problem, difficulty, host_id: userId, call_id: callId })
      .select(`*, host:users!sessions_host_id_fkey(id, name, email, profile_image, supabase_id)`)
      .single();

    if (error) throw error;

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    const { data: sessions, error } = await supabase
      .from("sessions")
      .select(`*, host:users!sessions_host_id_fkey(id, name, email, profile_image, supabase_id), participant:users!sessions_participant_id_fkey(id, name, email, profile_image, supabase_id)`)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user.id;

    const { data: sessions, error } = await supabase
      .from("sessions")
      .select(`*, host:users!sessions_host_id_fkey(id, name, email, profile_image, supabase_id), participant:users!sessions_participant_id_fkey(id, name, email, profile_image, supabase_id)`)
      .eq("status", "completed")
      .or(`host_id.eq.${userId},participant_id.eq.${userId}`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const { data: session, error } = await supabase
      .from("sessions")
      .select(`*, host:users!sessions_host_id_fkey(id, name, email, profile_image, supabase_id), participant:users!sessions_participant_id_fkey(id, name, email, profile_image, supabase_id)`)
      .eq("id", id)
      .single();

    if (error || !session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get session
    const { data: session, error: fetchError } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host_id === userId) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    if (session.participant_id) return res.status(409).json({ message: "Session is full" });

    // Update session with participant
    const { data: updatedSession, error: updateError } = await supabase
      .from("sessions")
      .update({ participant_id: userId })
      .eq("id", id)
      .select(`*, host:users!sessions_host_id_fkey(id, name, email, profile_image, supabase_id), participant:users!sessions_participant_id_fkey(id, name, email, profile_image, supabase_id)`)
      .single();

    if (updateError) throw updateError;

    res.status(200).json({ session: updatedSession });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get session
    const { data: session, error: fetchError } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !session) return res.status(404).json({ message: "Session not found" });

    if (session.host_id !== userId) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // Update session status
    const { data: updatedSession, error: updateError } = await supabase
      .from("sessions")
      .update({ status: "completed" })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.status(200).json({ session: updatedSession, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
