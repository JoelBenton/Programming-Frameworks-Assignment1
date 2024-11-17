"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import type { Collection } from "@/lib/definitions";
import { fetchCollections } from "@/lib/api";

// Define the context
const CollectionsContext = createContext<{
    collections: Collection[] | null;
    refreshCollections: () => Promise<void>;
}>({
    collections: null,
    refreshCollections: async () => {},
});

// Hook to use the CollectionsContext
export const useCollectionsData = () => {
    const context = useContext(CollectionsContext);
    if (!context) {
        throw new Error(
            "useCollectionsData must be used within a CollectionsProvider"
        );
    }
    return context;
};

// Define the provider props
type CollectionsProviderProps = {
    children: React.ReactNode;
};

export const CollectionsProvider: React.FC<CollectionsProviderProps> = ({
    children,
}) => {
    const [collections, setCollections] = useState<Collection[] | null>(null);

    // Memoize the collection fetching function
    const loadCollection = useCallback(async () => {
        try {
            const fetchedCollections = await fetchCollections();
            setCollections(fetchedCollections);
        } catch (error) {
            console.error("Failed to fetch collections:", error);
        }
    }, []);

    // Initial fetch on mount
    useEffect(() => {
        loadCollection();
    }, [loadCollection]);

    return (
        <CollectionsContext.Provider
            value={{
                collections,
                refreshCollections: loadCollection,
            }}
        >
            {children}
        </CollectionsContext.Provider>
    );
};