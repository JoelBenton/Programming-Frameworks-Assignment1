import React from "react";
import SidebarWrapper from "@/components/SidebarWrapper";
import { FlashcardSetsProvider } from "@/components/context/FlashcardSetsContext";
import { redirect } from "next/navigation";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    try {
        const response = await fetch(`http://localhost:3333/api/sets`, {
          method: "GET",
          headers: {
            "content-type": "application/json"
          },
        });
    
        const flashcardData = await response.json();

        return (
            <FlashcardSetsProvider flashcardData={flashcardData.data}>
                <main className="font-work-sans overflow-hidden flex flex-row">
                    <SidebarWrapper />
                    <div className="flex flex-col flex-1">
                        {children}
                    </div>
                </main>
            </FlashcardSetsProvider>
        )
    } catch (error) {
        console.error('Error fetching flashcard data:', error);
        redirect("/error");
    }
}