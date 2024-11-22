"use client";

import React, { useEffect } from "react";
import { useFlashcardSetsData } from "@/components/context/FlashcardSetsContext";
import Carousel from "@/components/Carousel";
import type { Collection, FlashcardSet } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/context/SessionContext";
import { useCollectionsData } from "@/components/context/CollectionsContext";

const Page = () => {
    const flashcardUsersSetsContext = useFlashcardSetsData();
    const collectionsContext = useCollectionsData();
    const sessionContext = useSession();
    const router = useRouter();

    const session = sessionContext.session;
    const userId = session?.id;

    useEffect(() => {
        flashcardUsersSetsContext.loadFlashcards("user", String(userId) || "");
    }, [session, flashcardUsersSetsContext.loadFlashcards]);

    useEffect(() => {
        collectionsContext.refreshCollections();
    }, [session, collectionsContext.refreshCollections]);

    const flashcardSets = flashcardUsersSetsContext.flashcardSets || [];
    const collections = collectionsContext.collections || []

    const UserCollections = collections.filter((collection) => collection.user.id === userId)

    if (!session) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-gray-700 bg-gray-100 p-4 rounded-xl shadow-xl">
                    <span
                        className="font-bold text-blue-600"
                        onClick={() => router.push("/login")}
                    >
                       Please Login to see the Library
                    </span>
                </p>
            </div>
        );
    }

    if (!flashcardSets) {
        return <></>;
    }

    const handleItemClick = (set: FlashcardSet) => {
        router.push(`/flashcards/${set.id}`);
    };

    const handleCollectionClick = (collection: Collection) => {
        router.push(`/collections/${collection.id}`);
    };

    const renderFlashcardSet = (set: FlashcardSet) => (
        <>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {set.name}
            </h3>
            <p className="text-sm text-gray-600">Cards: {set.cards.length}</p>
        </>
    );

    const renderCollectionSet = (collection: Collection) => (
        <>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {collection.name}
            </h3>
            <p className="text-sm text-gray-600">Sets: {collection.sets.length}</p>
        </>
    );

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mt-10 mb-32">User Library</h1>
            <Carousel
                items={flashcardSets}
                renderItem={renderFlashcardSet}
                title="Created Flashcard Sets"
                itemsPerPage={2}
                clickable={true}
                onClick={handleItemClick}
            />
            <div className="p-10"></div>

            <Carousel
                items={UserCollections}
                renderItem={renderCollectionSet}
                title="Created Collections"
                itemsPerPage={2}
                clickable={true}
                onClick={handleCollectionClick}
            />
        </div>
    );
};

export default Page;
