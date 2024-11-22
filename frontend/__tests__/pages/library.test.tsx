import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useFlashcardSetsData } from "@/components/context/FlashcardSetsContext";
import { useSession } from "@/components/context/SessionContext";
import { useCollectionsData } from "@/components/context/CollectionsContext";
import { useRouter } from "next/navigation";
import Page from "@/app/(root)/library/page";

// Mock contexts and router
jest.mock("@/components/context/FlashcardSetsContext", () => ({
    useFlashcardSetsData: jest.fn(),
}));

jest.mock("@/components/context/SessionContext", () => ({
    useSession: jest.fn(),
}));

jest.mock("@/components/context/CollectionsContext", () => ({
    useCollectionsData: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

describe("Library Page", () => {
    const mockFlashcardSetsContext = {
        flashcardSets: [
            {
                id: 1,
                name: "Math Basics",
                cards: [{ id: 1 }, { id: 2 }],
            },
        ],
        loadFlashcards: jest.fn(),
    };

    const mockCollectionsContext = {
        collections: [
            {
                id: 1,
                name: "Science",
                user: { id: 123 },
                sets: [{ id: 1 }, { id: 2 }],
            },
        ],
        refreshCollections: jest.fn(),
    };

    const mockSession = {
        session: { id: 123 },
        refreshSession: jest.fn(),
        logout: jest.fn(),
    };

    const mockRouter = {
        push: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useFlashcardSetsData as jest.Mock).mockReturnValue(mockFlashcardSetsContext);
        (useCollectionsData as jest.Mock).mockReturnValue(mockCollectionsContext);
        (useSession as jest.Mock).mockReturnValue(mockSession);
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it("renders the login prompt if no session exists", () => {
        (useSession as jest.Mock).mockReturnValueOnce({
            ...mockSession,
            session: null,
        });

        render(<Page />);

        expect(screen.getByText(/Please Login to see the Library/i)).toBeInTheDocument();
    });

    it("renders the User Library page if a session exists", async () => {
        render(<Page />);

        expect(screen.getByText(/User Library/i)).toBeInTheDocument();
        expect(screen.getByText(/Created Flashcard Sets/i)).toBeInTheDocument();
        expect(screen.getByText(/Created Collections/i)).toBeInTheDocument();
    });

    it("renders the flashcard sets carousel", async () => {
        render(<Page />);

        expect(screen.getByText("Math Basics")).toBeInTheDocument();
        expect(screen.getByText("Cards: 2")).toBeInTheDocument();
    });

    it("renders the collections carousel for the logged-in user", async () => {
        render(<Page />);

        expect(screen.getByText("Science")).toBeInTheDocument();
        expect(screen.getByText("Sets: 2")).toBeInTheDocument();
    });

    it("navigates to the flashcard set details on item click", async () => {
        render(<Page />);

        const flashcardSet = screen.getByText("Math Basics");
        flashcardSet.click();

        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith("/flashcards/1");
        });
    });

    it("navigates to the collection details on item click", async () => {
        render(<Page />);

        const collection = screen.getByText("Science");
        collection.click();

        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith("/collections/1");
        });
    });

    it("calls loadFlashcards and refreshCollections on mount", () => {
        render(<Page />);

        expect(mockFlashcardSetsContext.loadFlashcards).toHaveBeenCalledWith("user", "123");
        expect(mockCollectionsContext.refreshCollections).toHaveBeenCalled();
    });
});