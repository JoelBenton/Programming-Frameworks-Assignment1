'use client'
import React, { createContext, useContext, useState } from "react";
import type { SessionPayload } from "@/lib/definitions"; // replace with correct path

const SessionContext = createContext<SessionPayload | null>(null);

export const useSession = () => {
  return useContext(SessionContext);
};

type SessionProviderProps = {
  children: React.ReactNode;
  initialSession: SessionPayload | null;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({ children, initialSession }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [session, setSession] = useState<SessionPayload | null>(initialSession);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};