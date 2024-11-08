import { redirect } from "next/navigation";
import React from "react";
import { FlashcardSetsProvider } from "@/components/context/FlashcardSetsContext";
import { checkSession } from "@/lib/auth";

interface Params {
  params: {
    id: string;
  };
}

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode; params: Params["params"] }>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  (await checkSession()) || redirect('/');

  try {
    const response = await fetch(`http://localhost:3333/api/sets`, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      },
    });

    if (!response.ok) {
      alert('Error retrieving flashcard Sets! Try again later')
      console.error('Error while retrieving Flashcard Sets' + response)
      window.history.back()
    }

    const flashcardData = await response.json();

    if (!flashcardData) {
      alert('Failed to find flashcard, Try again later')
      redirect('/');
    }

    return (
      <FlashcardSetsProvider flashcardData={flashcardData.data}>
          <main className="h-full">{children}</main>
      </FlashcardSetsProvider>
    );

  } catch (error) {
    alert('Error retrieving flashcard Sets! Try again later')
    console.error('Error fetching flashcard data:', error);
    window.history.back()
  }
}