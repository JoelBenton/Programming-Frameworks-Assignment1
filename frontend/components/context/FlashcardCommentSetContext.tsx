'use client'
import React, { createContext, useContext, useState } from "react";
import type { FlashcardSet, Comment } from "@/lib/definitions"; // replace with correct path

const FlashcardCommentSetContext = createContext<FlashcardSet & { comments: Comment[] } | null>(null);

export const useFlashcardCommentSetData = () => {
  return useContext(FlashcardCommentSetContext);
};

type SessionProviderProps = {
  children: React.ReactNode;
  flashcardData: (FlashcardSet & { comments: Comment[] });
};

export const FlashcardCommentSetProvider: React.FC<SessionProviderProps> = ({ children, flashcardData }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet & { comments: Comment[] }>(flashcardData);

  return (
    <FlashcardCommentSetContext.Provider value={flashcardSet}>
      {children}
    </FlashcardCommentSetContext.Provider>
  );
};