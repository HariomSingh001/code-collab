import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";

/**
 * Hook for real-time session chat using Supabase Realtime Broadcast.
 * Messages are ephemeral — they exist only while the session is active.
 * No database table needed.
 *
 * @param {string} sessionId
 * @param {string} userName
 */
export function useSessionChat(sessionId, userName) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    // Add welcome system message
    setMessages([
      {
        id: "system-welcome",
        sender: "system",
        text: `Chat connected — session ${sessionId.slice(0, 8)}...`,
        time: new Date().toISOString(),
      },
    ]);

    const channel = supabase.channel(`session-chat-${sessionId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on("broadcast", { event: "message" }, ({ payload }) => {
        if (payload) {
          setMessages((prev) => [...prev, { ...payload, isOwn: false }]);
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
      setIsConnected(false);
    };
  }, [sessionId]);

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim()) return;

      const message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender: userName || "Guest",
        text: text.trim(),
        time: new Date().toISOString(),
      };

      // Add to local state immediately (own message)
      setMessages((prev) => [...prev, { ...message, isOwn: true }]);

      // Broadcast to other participants (self: false means we won't receive our own)
      channelRef.current?.send({
        type: "broadcast",
        event: "message",
        payload: message,
      });
    },
    [userName]
  );

  const addSystemMessage = useCallback((text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `system-${Date.now()}`,
        sender: "system",
        text,
        time: new Date().toISOString(),
      },
    ]);
  }, []);

  return { messages, sendMessage, addSystemMessage, isConnected };
}
