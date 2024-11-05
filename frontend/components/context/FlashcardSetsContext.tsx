'use client'
import React, { createContext, useContext, useState } from "react";
import type { Flashcard } from "@/lib/definitions"; // replace with correct path

const FlashcardSetsContext = createContext<Flashcard[] | null>(null);

export const useFlashcardSetsData = () => {
  return useContext(FlashcardSetsContext);
};

type SessionProviderProps = {
  children: React.ReactNode;
  flashcardData: (Flashcard[] ) | null;
};

export const FlashcardSetsProvider: React.FC<SessionProviderProps> = ({ children, flashcardData }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [flashcardSet, setFlashcardSet] = useState<Flashcard[] | null>(flashcardData);

  return (
    <FlashcardSetsContext.Provider value={flashcardSet}>
      {children}
    </FlashcardSetsContext.Provider>
  );
};