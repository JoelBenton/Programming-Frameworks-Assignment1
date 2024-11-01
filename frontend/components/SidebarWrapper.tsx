import Sidebar from "./Sidebar";
import { getSession } from "@/lib/session";

export default async function SidebarWrapper() {
    const session = await getSession(); // Server-side call

    return <Sidebar session={session} />;
}