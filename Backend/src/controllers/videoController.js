import { ENV } from "../lib/env.js";

const DAILY_API_URL = "https://api.daily.co/v1";

/**
 * Create (or fetch if already exists) a Daily.co room for a session.
 * Returns the room URL + a short-lived meeting token for the requesting user.
 *
 * POST /api/video/room
 * Body: { sessionId: string }
 */
export const createOrGetRoom = async (req, res) => {
  try {
    const { sessionId } = req.body;
    console.log("createOrGetRoom called, sessionId:", sessionId);

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    // Defensively trim whitespace (common source of Bearer auth failures)
    const apiKey = ENV.DAILY_API_KEY?.trim();

    if (!apiKey) {
      return res.status(500).json({
        message: "Video service not configured. Set DAILY_API_KEY in backend .env",
      });
    }

    // Room names must be URL-safe and start with a letter. Truncate to Daily's 41 char limit.
    const roomName = `codest-${sessionId.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase()}`.slice(0, 41);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    // Helper to create a new room
    const createRoom = async () => {
      const createRes = await fetch(`${DAILY_API_URL}/rooms`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: roomName,
          privacy: "public",
          properties: {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
            enable_screenshare: true,
            enable_chat: true,
            enable_prejoin_ui: false,
          },
        }),
      });
      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error(`Daily create room error [${createRes.status}]:`, errText);
        return null;
      }
      return await createRes.json();
    };

    // 1. Try to fetch existing room
    let room = null;
    const getRes = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, { headers });

    if (getRes.ok) {
      const existing = await getRes.json();
      const expiry = existing.config?.exp;
      const now = Math.floor(Date.now() / 1000);

      if (expiry && expiry < now) {
        // Room expired — delete it and create a fresh one
        console.log("Room expired, recreating:", roomName);
        await fetch(`${DAILY_API_URL}/rooms/${roomName}`, { method: "DELETE", headers });
        room = await createRoom();
      } else {
        room = existing;
        console.log("Using existing Daily room:", roomName);
      }
    } else {
      // Room doesn't exist — create it
      console.log("Creating new Daily room:", roomName);
      room = await createRoom();
    }

    if (!room) {
      return res.status(500).json({ message: "Failed to create video room" });
    }

    // 2. Create a short-lived meeting token for this user
    const userName = req.user?.name || req.user?.email?.split("@")[0] || "Guest";

    const tokenRes = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_name: userName,
          user_id: req.user?.supabase_id || `guest-${Date.now()}`,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2 hour token
        },
      }),
    });

    let token = null;
    if (tokenRes.ok) {
      const tokenData = await tokenRes.json();
      token = tokenData.token;
    } else {
      // Token failure isn't fatal — public rooms work without one
      console.warn("Failed to create Daily meeting token:", await tokenRes.text());
    }

    return res.status(200).json({
      url: room.url,
      roomName: room.name,
      token,
    });
  } catch (error) {
    console.error("createOrGetRoom error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
