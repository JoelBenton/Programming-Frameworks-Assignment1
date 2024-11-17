import type {
    User,
    FlashcardSet,
    FlashcardCommentSet,
    Collection,
} from "./definitions";

export const fetchUsers = async (): Promise<User[] | null> => {
    try {
        const user_response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_BASE}/api/users`,
            {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
            },
        );

        return (await user_response.json()).data;
    } catch (error) {
        console.error("Error fetching users: ", error);
        return null;
    }
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_BASE;

export async function fetchFlashcardSets(): Promise<FlashcardSet[] | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/sets`, {
            method: "GET",
            headers: { "content-type": "application/json" },
        });

        if (response.ok) {
            return (await response.json()).data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching flashcard sets:", error);
        return null;
    }
}

export async function fetchUserFlashcardSets(
    userId: string,
): Promise<FlashcardSet[] | null> {
    try {
        if (!userId || userId == "") {
            return null;
        }

        const response = await fetch(
            `${API_BASE_URL}/api/users/${userId}/sets`,
            {
                method: "GET",
                headers: { "content-type": "application/json" },
            },
        );

        if (response.ok) {
            return (await response.json()).data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user flashcard sets:", error);
        return null;
    }
}

export async function fetchFlashcardCommentSet(
    flashcardSetId: string,
): Promise<FlashcardCommentSet | null> {
    try {
        if (!flashcardSetId || flashcardSetId == "") {
            return null;
        }

        const response = await fetch(
            `${API_BASE_URL}/api/sets/${flashcardSetId}`,
            {
                method: "GET",
                headers: { "content-type": "application/json" },
            },
        );

        if (response.ok) {
            return (await response.json()).data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user flashcard sets:", error);
        return null;
    }
}

export async function fetchCollections(): Promise<Collection[] | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/collections`, {
            method: "GET",
            headers: { "content-type": "application/json" },
        });

        if (response.ok) {
            return (await response.json()).data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching flashcard sets:", error);
        return null;
    }
}
