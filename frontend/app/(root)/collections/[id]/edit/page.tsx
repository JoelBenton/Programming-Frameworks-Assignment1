"use client";

import React, { useEffect, useState } from "react";
import FlashcardSetModal from "@/components/FlashcardSetModal";
import { Collection, FlashcardSet } from "@/lib/definitions";
import { useUsers } from "@/components/context/UsersContext";
import { useFlashcardSetsData } from "@/components/context/FlashcardSetsContext";
import { useSession } from "@/components/context/SessionContext";
import { sleep } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useCollectionsData } from "@/components/context/CollectionsContext";

const Page: React.FC = () => {
    const sessionContext = useSession();
    const collectionsContext = useCollectionsData();
    const params = useParams();
    const session = sessionContext.session || null;
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedSets, setSelectedSets] = useState<(FlashcardSet & { comment: string })[]>([]);
    const [loading, setLoading] = useState(false);
    const [validatedData, setValidatedData] = useState<Collection | null>(null);

    const userContext = useUsers();
    const flashcardSetsContext = useFlashcardSetsData();

    // Fetch collection for editing
    const collectionId = params.id; // Assuming the collection ID is passed in the URL

    useEffect(() => {
        if (!flashcardSetsContext.flashcardSets) {
            flashcardSetsContext.loadFlashcards("all");
        }
    }, [flashcardSetsContext]);

    useEffect(() => {
        if (!collectionsContext.collections) {
            collectionsContext.refreshCollections();
        } else if (collectionId) {
            const collectionToEdit = collectionsContext.collections.find(
                (col) => col.id === Number(collectionId)
            );
            if (collectionToEdit) {
                setTitle(collectionToEdit.name);
                setSelectedSets(collectionToEdit.sets.map((set) => ({ ...set.set, comment: set.comment })));
                setValidatedData(collectionToEdit);
            }
        }
    }, [collectionsContext, collectionId]);

    useEffect(() => {
        if (!session) return;
        if (validatedData) {
            const createOrUpdateCollection = async () => {
                if (!loading || !validatedData) return;

                try {
                    const url = `${process.env.NEXT_PUBLIC_API_URL_BASE}/api/users/${validatedData.user.id}/collections/${validatedData.id}`;
                    const response = await fetch(url, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user.token}`,
                        },
                        body: JSON.stringify(validatedData),
                    });

                    if (response.ok) {
                        await sleep(400);
                        collectionsContext.refreshCollections()
                        router.push(`/collections`);
                    } else if (response.status === 403) {
                        alert("User not authorised to update collections! Please login first.");
                    } else if (response.status === 404) {
                        alert("Error while updating collection! Please try again later.");
                    }
                } catch (error) {
                    console.log(error);
                    alert("Unexpected Error : Error - " + error);
                } finally {
                    setLoading(false);
                }
            };

            createOrUpdateCollection();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, validatedData, session]);

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
                    to edit collections
                </p>
            </div>
        );
    }

    if (!validatedData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-red-500 bg-gray-100 p-4 rounded-xl shadow-xl">
                         Loading collection data / Failed to load collection. Please try again later.
                </p>
            </div>
        );
    }

    const flashcardSets = flashcardSetsContext.flashcardSets || [];
    const users = userContext.users || [];

    const unselectedFlashcardSets = flashcardSets.filter(
        (set) => !selectedSets.find((selected) => selected.id === set.id),
    );

    const handleSelectSet = (set: FlashcardSet) => {
        if (!selectedSets.find((selected) => selected.id === set.id)) {
            setSelectedSets([...selectedSets, { ...set, comment: "" }]);
        }
        setShowModal(false);
    };

    const handleRemoveSet = (id: number) => {
        setSelectedSets(selectedSets.filter((selected) => selected.id !== id));
    };

    const handleSetCommentChange = (setId: number, comment: string) => {
        setSelectedSets((prevSets) =>
            prevSets.map((set) =>
                set.id === setId ? { ...set, comment } : set,
            ),
        );
    };

    const handleUpdateCollection = () => {
        if (!title.trim() || selectedSets.length === 0) {
            alert("Please add a title and select at least one set.");
            return;
        }

        const allSetsHaveComments = selectedSets.every(
            (set) => set.comment.trim() !== "",
        );

        if (!allSetsHaveComments) {
            alert("Please add a comment for each selected set.");
            return;
        }

        const collectionData: Collection = {
            ...validatedData, // Keep existing collection data for updating
            id: validatedData?.id, // Keep existing ID for update, or set new ID for creation
            name: title,
            sets: selectedSets.map((set) => ({
                id: set.id,
                comment: set.comment,
                set: set,
            })),
            user: validatedData?.user || {
                id: -1,
                username: '',
            }
        };

        // Save the validated collection data to state
        setValidatedData(collectionData);
        setLoading(true);
    };

    return (
        <div className="flex justify-center items-start min-h-screen py-10 overflow-auto">
            <div className="flex w-3/5 h-full flex-col items-start p-6 shadow-xl rounded-3xl">
                <div className="p-3 pt-10 w-full pb-10 text-4xl font-bold">
                    Update Collection
                </div>

                <input
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#ddf8ec] to-[#b3c7f9] text-black p-2"
                    placeholder='Enter a title, like "World History"'
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />

                <div className="p-3 pt-10 text-4xl font-bold">Sets</div>

                <button
                    className="w-full h-12 rounded-xl bg-blue-500 text-white p-2 mt-4"
                    onClick={() => setShowModal(true)}
                >
                    Add Flashcard Sets
                </button>

                {selectedSets.length > 0 ? (
                    <ul className="mt-6 space-y-4 w-full">
                        {selectedSets.map((set) => (
                            <li
                                key={set.id}
                                className="w-full bg-gradient-to-br from-[#c2e0d3] to-[#b3c7f9] rounded-xl shadow-xl p-4 flex flex-col space-y-2"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-lg font-bold">
                                            {set.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Cards: {set.cards.length} | Author:{" "}
                                            {users.find(
                                                (u) => u.id === set.user_id,
                                            )?.username || "Unknown"}
                                        </p>
                                    </div>
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleRemoveSet(set.id)}
                                    >
                                        Remove
                                    </button>
                                </div>

                                <input
                                    className="mt-2 p-2 w-full h-10 rounded-xl text-black bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add a comment for this set..."
                                    value={set.comment}
                                    onChange={(e) =>
                                        handleSetCommentChange(
                                            set.id,
                                            e.target.value,
                                        )
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-6 text-gray-500 italic">
                        No sets selected yet.
                    </p>
                )}

                <div className="flex justify-center mt-6 w-full">
                    <button
                        onClick={handleUpdateCollection}
                        className="w-[200px] h-12 rounded-xl bg-blue-500 text-white p-2"
                    >
                        Update Collection
                    </button>
                </div>
            </div>

            {showModal && (
                <FlashcardSetModal
                    flashcardSets={unselectedFlashcardSets}
                    users={users}
                    onSelect={handleSelectSet}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default Page;