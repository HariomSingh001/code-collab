import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setIsSignedIn(!!session?.user);
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsSignedIn(!!session?.user);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return {
    isSignedIn,
    user,
    isLoaded,
    isAuthenticated: isSignedIn,
  };
};
