"use client";

import React, { useEffect } from "react";
import { useFlashcardSetsData } from "@/components/context/FlashcardSetsContext";
import Carousel from "@/components/Carousel";
import type { FlashcardSet } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/context/SessionContext";

const Page = () => {
    const flashcardUsersSetsContext = useFlashcardSetsData();
    const sessionContext = useSession();
    const router = useRouter();

    const session = sessionContext.session;
    const userId = session?.user.id;

    useEffect(() => {
        flashcardUsersSetsContext.loadFlashcards("user", String(userId) || "");
    }, [session, flashcardUsersSetsContext.loadFlashcards]);

    const flashcardSets = flashcardUsersSetsContext.flashcardSets || [];

    if (!session) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-gray-700 bg-gray-100 p-4 rounded-xl shadow-xl">
                    Please{" "}
                    <span
                        className="font-bold text-blue-600"
                        onClick={() => router.push("/login")}
                    >
                        Login
                    </span>{" "}
                    to see the Library
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

    const renderFlashcardSet = (set: FlashcardSet) => (
        <>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {set.name}
            </h3>
            <p className="text-sm text-gray-600">Cards: {set.cards.length}</p>
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
        </div>
    );
};

export default Page;
