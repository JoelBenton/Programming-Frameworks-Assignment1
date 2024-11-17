import React from "react";
import SidebarWrapper from "@/components/SidebarWrapper";
import { FlashcardSetsProvider } from "@/components/context/FlashcardSetsContext";
import ErrorPage from "@/components/ErrorPage";
import { UsersProvider } from "@/components/context/UsersContext";
import { SessionProvider } from "@/components/context/SessionContext";
import { FlashcardCommmentSetProvider } from "@/components/context/FlashcardCommentSetContext";
import { CollectionsProvider } from "@/components/context/CollectionsContext";

export default async function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    try {
        return (
            <SessionProvider>
                <FlashcardSetsProvider>
                    <FlashcardCommmentSetProvider>
                        <UsersProvider>
                            <CollectionsProvider>
                                <main className="font-work-sans overflow-hidden flex flex-row">
                                    <SidebarWrapper />
                                    <div className="flex flex-col flex-1">
                                        {children}
                                    </div>
                                </main>
                            </CollectionsProvider>
                        </UsersProvider>
                    </FlashcardCommmentSetProvider>
                </FlashcardSetsProvider>
            </SessionProvider>
        );
    } catch (error) {
        console.log(error);
        console.error("Error fetching data:", error);
        return <ErrorPage />;
    }
}
