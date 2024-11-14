"use client"; // Add this directive at the top of the file

import React, { createContext, useContext, useState, useEffect } from "react";
import { getSession, deleteSession } from "@/lib/session";
import type { SessionPayload } from "@/lib/definitions";  // Assuming you have a SessionPayload type

// Creating the context with default values
const SessionContext = createContext<{
  session: SessionPayload | null;
  refreshSession: () => void;
  logout: () => void;
}>({
  session: null,
  refreshSession: () => {},
  logout: () => {},
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SessionPayload | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await getSession();
        if (sessionData) {
          // If sessionData is valid, parse it; otherwise, set session to null
          const parsedSession = sessionData ? JSON.parse(sessionData) : null;
          setSession(parsedSession);
        } else {
          setSession(null); // If no session data, set session to null
        }
      } catch (error) {
        console.error("Failed to load session:", error);
        setSession(null); // Handle parsing errors gracefully
      }
    };

    fetchSession();
  }, []);

  const refreshSession = async () => {
    try {
      const updatedSession = await getSession();
      setSession(updatedSession ? JSON.parse(updatedSession) : null); // Ensure the session is valid
    } catch (error) {
      console.error("Failed to refresh session:", error);
      setSession(null); // Handle errors gracefully
    }
  };

  const logout = async () => {
    try {
      await deleteSession();
      setSession(null); // Clear session from state
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <SessionContext.Provider value={{ session, refreshSession, logout }}>
      {children}
    </SessionContext.Provider>
  );
};