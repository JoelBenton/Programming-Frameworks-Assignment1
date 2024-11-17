// FlashcardSetsContext.tsx
"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import type { FlashcardCommentSet } from "@/lib/definitions";
import { fetchFlashcardCommentSet } from "@/lib/api";

// Define the context
const FlashcardCommentSetContext = createContext<{
    flashcardCommentSet: FlashcardCommentSet | null;
    loadFlashcardCommentSet: (flashcardSetId: string) => Promise<void>;
        } | null>(null);

export const useFlashcardCommentSetData = () => {
    const context = useContext(FlashcardCommentSetContext);
    if (!context) {
        throw new Error(
            "useFlashcardSetsData must be used within a FlashcardSetsProvider",
        );
    }
    return context;
};

// Define the provider props
type FlashcardSetsProviderProps = {
    children: React.ReactNode;
};

export const FlashcardCommmentSetProvider: React.FC<
    FlashcardSetsProviderProps
> = ({ children }) => {
    // Local state to hold flashcard sets
    const [flashcardCommentSet, setFlashcardCommentSet] =
        useState<FlashcardCommentSet | null>(null);

    // Function to load flashcards based on API type
    const loadFlashcardCommentSet = useCallback(
        async (flashcardSetId: string) => {
            try {
                let data: FlashcardCommentSet | null = null;

                data = await fetchFlashcardCommentSet(flashcardSetId);

                setFlashcardCommentSet(data);
            } catch (error) {
                console.error("Error loading flashcards", error);
            }
        },
        [],
    );

    return (
        <FlashcardCommentSetContext.Provider
            value={{ flashcardCommentSet, loadFlashcardCommentSet }}
        >
            {children}
        </FlashcardCommentSetContext.Provider>
    );
};
