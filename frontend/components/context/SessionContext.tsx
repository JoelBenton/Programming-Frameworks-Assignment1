"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSession, deleteSession } from "@/lib/session";
import type { SessionPayload } from "@/lib/definitions";

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

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [session, setSession] = useState<SessionPayload | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const sessionData = await getSession();
                setSession(sessionData ? JSON.parse(sessionData) : null);
            } catch (error) {
                console.error("Failed to load session:", error);
                setSession(null);
            }
        };

        fetchSession();
    }, []);

    // Memoize the refreshSession function
    const refreshSession = useCallback(async () => {
        try {
            const updatedSession = await getSession();
            setSession(updatedSession ? JSON.parse(updatedSession) : null);
        } catch (error) {
            console.error("Failed to refresh session:", error);
            setSession(null);
        }
    }, []);

    // Memoize the logout function
    const logout = useCallback(async () => {
        try {
            await deleteSession();
            setSession(null);
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    }, []);

    return (
        <SessionContext.Provider value={{ session, refreshSession, logout }}>
            {children}
        </SessionContext.Provider>
    );
};