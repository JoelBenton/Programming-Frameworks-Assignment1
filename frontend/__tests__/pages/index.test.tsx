import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/(root)/page"; // Adjust the import path if needed
import { useUsers } from "@/components/context/UsersContext";
import { useSession } from "@/components/context/SessionContext";
import { useFlashcardSetsData } from "@/components/context/FlashcardSetsContext";
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

jest.mock("@/components/context/UsersContext", () => ({
    useUsers: jest.fn(),
}));

jest.mock("@/components/context/SessionContext", () => ({
    useSession: jest.fn(),
}));

jest.mock("@/components/context/FlashcardSetsContext", () => ({
    useFlashcardSetsData: jest.fn(),
}));

jest.mock("@/components/Flashcard", () => jest.fn(() => <div data-testid="flashcard">Mock Flashcard</div>));
jest.mock("@/components/Pagination", () => jest.fn(() => <div data-testid="pagination">Mock Pagination</div>));
jest.mock("@/components/ErrorPage", () => jest.fn(() => <div data-testid="error-page">Mock ErrorPage</div>));

describe("Home Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
  
  
    it("renders the flashcards and pagination when data is available", () => {
        (useUsers as jest.Mock).mockReturnValue({
            users: [{ id: 1, username: "testuser", admin: false }],
        });
        (useSession as jest.Mock).mockReturnValue({
            session: { id: 1, username: "testuser" },
        });
        (useFlashcardSetsData as jest.Mock).mockReturnValue({
            flashcardSets: [
                {
                    id: 1,
                    name: "Test Set",
                    user_id: 1,
                    cards: [{ question: "Q1", answer: "A1" }],
                    created_at: "2024-01-01T00:00:00Z",
                    updated_at: "2024-01-02T00:00:00Z",
                },
            ],
            loadFlashcards: jest.fn(),
        });
  
        render(<Home />);
        expect(screen.getByTestId("flashcard")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });
  
    it("handles flashcard preview when a flashcard is clicked", () => {
        const mockRouterPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockRouterPush,
        });
  
        (useUsers as jest.Mock).mockReturnValue({
            users: [{ id: 1, username: "testuser", admin: false }],
        });
        (useSession as jest.Mock).mockReturnValue({
            session: { id: 1, username: "testuser" },
        });
        (useFlashcardSetsData as jest.Mock).mockReturnValue({
            flashcardSets: [
                {
                    id: 1,
                    name: "Test Set",
                    user_id: 1,
                    cards: [{ question: "Q1", answer: "A1" }],
                    created_at: "2024-01-01T00:00:00Z",
                    updated_at: "2024-01-02T00:00:00Z",
                },
            ],
            loadFlashcards: jest.fn(),
        });
  
        render(<Home />);
        fireEvent.click(screen.getByText("Study"));
        expect(mockRouterPush).toHaveBeenCalledWith("/flashcards/1");
    });
  
    it("displays a message when no flashcards are available", () => {
        (useUsers as jest.Mock).mockReturnValue({
            users: [{ id: 1, username: "testuser", admin: false }],
        });
        (useSession as jest.Mock).mockReturnValue({
            session: { id: 1, username: "testuser" },
        });
        (useFlashcardSetsData as jest.Mock).mockReturnValue({
            flashcardSets: [],
            loadFlashcards: jest.fn(),
        });
  
        render(<Home />);
        expect(screen.getByText("No flashcards available. Please add some flashcards to get started.")).toBeInTheDocument();
    });
});