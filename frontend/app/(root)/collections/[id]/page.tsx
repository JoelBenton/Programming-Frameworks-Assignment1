"use client";

import React, { useEffect, useMemo } from "react";
import { useCollectionsData } from "@/components/context/CollectionsContext";
import { useParams, useRouter } from "next/navigation";
import { FlashcardSet } from "@/lib/definitions";
import { useUsers } from "@/components/context/UsersContext";
import { useSession } from "@/components/context/SessionContext";

const Page = () => {
    const collectionsContext = useCollectionsData();
    const usersContext = useUsers();
    const sessionContext = useSession();
    const params = useParams();
    const router = useRouter();

    // Only trigger session refresh if session is not set (null or undefined)
    useEffect(() => {
        if (!sessionContext.session) {
            sessionContext.refreshSession();
        }
    }, [sessionContext]);

    // Only trigger collections refresh if collections are not loaded
    useEffect(() => {
        if (!collectionsContext.collections) {
            collectionsContext.refreshCollections();
        }
    }, [collectionsContext]);

    const session = sessionContext.session

    const collections = useMemo(() => collectionsContext.collections || [], [collectionsContext.collections]);
    const users = useMemo(() => usersContext.users || [], [usersContext.users]);

    const collection = collections.find((collection) => collection.id === Number(params.id));

    if (!collection) {
        return <div className="text-center text-lg">Collection not found.</div>;
    }

    const onSetClick = (set: { comment: string; set: FlashcardSet }) => {
        router.push(`/flashcards/${set.set.id}`);
    };

    const handleEditRedirect = () => {
        router.push(`/collections/${collection.id}/edit`);
    };

    return (
        <div className="flex justify-center min-h-screen">
            <div className="flex flex-col items-center w-3/5 max-w-4xl shadow-xl rounded-xl my-20 p-6">
                <div className="text-center text-5xl font-bold mb-3">{collection.name}</div>
                <div className="text-lg text-gray-400">
                    Created by user: {collection.user.username || "Unknown"}
                </div>
                {session?.user.id == collection.user.id ? (
                    <button
                        className="text-blue-500 font-semibold mt-4"
                        onClick={handleEditRedirect}
                    >
                    Edit Collection
                    </button>
                ) : (
                    <></>
                )
                }
                <div className="text-center text-5xl font-bold my-10">Sets</div>
                {collection.sets.map((set, index) => {
                    const creator = users.find((user) => user.id === set.set.user_id);
                    return (
                        <div
                            key={index}
                            className="flex flex-col items-center bg-white p-4 rounded-xl shadow-md mb-4 w-5/6 cursor-pointer"
                            onClick={() => onSetClick(set)}
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{set.set.name}</h3>
                            <p className="text-sm text-gray-600">Cards: {set.set.cards.length}</p>
                            <p className="text-sm text-gray-600">
                                Created by: {creator?.username || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500 italic mt-2">
                                Collection Comment - {set.comment || "No comment provided"}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Page;