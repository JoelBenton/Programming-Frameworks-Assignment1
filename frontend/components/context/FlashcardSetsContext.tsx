// FlashcardSetsContext.tsx
'use client'
import React, { createContext, useContext, useState, useCallback } from "react";
import type { FlashcardSet } from "@/lib/definitions";
import { fetchFlashcardSets, fetchUserFlashcardSets } from "@/lib/api";

// Define the context
const FlashcardSetsContext = createContext<{
  flashcardSets: FlashcardSet[] | null;
  loadFlashcards: (apiType: 'user' | 'all', userId?: string) => Promise<void>;
} | null>(null);

// Hook to use the FlashcardSetsContext
export const useFlashcardSetsData = () => {
  const context = useContext(FlashcardSetsContext);
  if (!context) {
    throw new Error("useFlashcardSetsData must be used within a FlashcardSetsProvider");
  }
  return context;
};

// Define the provider props
type FlashcardSetsProviderProps = {
  children: React.ReactNode;
};

export const FlashcardSetsProvider: React.FC<FlashcardSetsProviderProps> = ({ children }) => {
  // Local state to hold flashcard sets
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[] | null>(null);

  // Function to load flashcards based on API type
  const loadFlashcards = useCallback(async (apiType: 'user' | 'all', userId?: string) => {
    try {
      let data: FlashcardSet[] | null = null;

      if (apiType === 'user' && userId) {
        data = await fetchUserFlashcardSets(userId);
      } else {
        data = await fetchFlashcardSets();
      }

      setFlashcardSets(data);
    } catch (error) {
      console.error("Error loading flashcards", error);
    }
  }, []);

  return (
    <FlashcardSetsContext.Provider value={{ flashcardSets, loadFlashcards }}>
      {children}
    </FlashcardSetsContext.Provider>
  );
};