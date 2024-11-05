import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import React from "react";
import { FlashcardCommentSetProvider } from "@/components/context/FlashcardCommentSetContext";
import { SessionProvider } from "@/components/context/SessionContext";
import { SessionPayload } from "@/lib/definitions";

interface Params {
  params: {
    id: string;
  };
}

export default async function Layout({
  children,
  params: initialParams,
}: Readonly<{ children: React.ReactNode; params: Params["params"] }>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  const session = await getSession() ?? ''
  const parsedSession = session ? JSON.parse(session) as SessionPayload : null

  const params = await initialParams; // Await params to resolve it asynchronously
  const { id } = params;

  try {
    const response = await fetch(`http://localhost:3333/api/sets/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        redirect("/404");
      } else if (response.status === 403) {
        redirect("/login");
      } else {
        redirect("/error");
      }
    }

    const flashcardData = await response.json();

    return (
      <FlashcardCommentSetProvider flashcardData={flashcardData.data}>
        <SessionProvider initialSession={parsedSession}>
          <main className="h-full">{children}</main>
        </SessionProvider>
      </FlashcardCommentSetProvider>
    );

  } catch (error) {
    console.error('Error fetching flashcard data:', error);
    redirect("/error");
  }
}