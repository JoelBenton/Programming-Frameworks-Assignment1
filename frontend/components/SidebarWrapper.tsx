"use client";

import { useSession } from "./context/SessionContext";
import Sidebar from "./Sidebar";

export default function SidebarWrapper() {
    const { session, refreshSession } = useSession() || {};
    return <Sidebar session={session} refreshSession={refreshSession} />;
}
