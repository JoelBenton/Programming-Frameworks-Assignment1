import React from "react";
import SidebarWrapper from "@/components/SidebarWrapper";
import { FlashcardSetsProvider } from "@/components/context/FlashcardSetsContext";
import ErrorPage from "@/components/ErrorPage";
import { UsersProvider } from "@/components/context/UsersContext";
import { SessionProvider } from "@/components/context/SessionContext";
import { FlashcardCommmentSetProvider } from "@/components/context/FlashcardCommentSetContext";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  try {


    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_BASE}/api/sets`, {
    //   method: "GET",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    // });

    // const flashcardData = await response.json();

    // const user_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_BASE}/api/users`, {
    //   method: "GET",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    // });

    // const userData = await user_response.json();

    return (
      <SessionProvider>
        <FlashcardSetsProvider>
          <FlashcardCommmentSetProvider>
            <UsersProvider>
              <main className="font-work-sans overflow-hidden flex flex-row">
                <SidebarWrapper />
                <div className="flex flex-col flex-1">{children}</div>
              </main>
            </UsersProvider>
          </FlashcardCommmentSetProvider>
        </FlashcardSetsProvider>
      </SessionProvider>
        
    );
  } catch (error) {
    console.log(error)
    console.error("Error fetching data:", error);
    return <ErrorPage />;
  }
}
