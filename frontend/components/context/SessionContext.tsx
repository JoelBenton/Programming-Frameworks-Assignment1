"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CurrentUser } from "@/lib/definitions";

const SessionContext = createContext<{
    session: CurrentUser | null;
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
    const [session, setSession] = useState<CurrentUser | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const sessionData = localStorage.getItem("user");
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
            const updatedSession = localStorage.getItem("user");
            setSession(updatedSession ? JSON.parse(updatedSession) : null);
        } catch (error) {
            console.error("Failed to refresh session:", error);
            setSession(null);
        }
    }, []);

    // Memoize the logout function
    const logout = useCallback(async () => {
        try {
            localStorage.removeItem("user");
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