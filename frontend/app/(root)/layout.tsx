import React from "react";
import SidebarWrapper from "@/components/SidebarWrapper";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    
    return (
            <main className="font-work-sans overflow-hidden flex flex-row">
                <SidebarWrapper />
                <div className="flex flex-col flex-1">
                    {children}
                </div>
            </main>
    )
}