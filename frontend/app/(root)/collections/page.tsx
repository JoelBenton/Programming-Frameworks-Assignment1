"use client";

import { useCollectionsData } from "@/components/context/CollectionsContext";
import { useUsers } from "@/components/context/UsersContext";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
    const collectionsContext = useCollectionsData();
    const usersContext = useUsers();
    const router = useRouter();

    const collections = collectionsContext.collections || [];
    const users = usersContext.users || [];

    return (
        <div className="flex flex-col h-screen w-full overflow-y-auto items-center p-6">
            <h1 className="text-4xl font-bold mb-6 text-center">Collections</h1>

            <div className="w-full max-w-3xl mt-6 space-y-6">
                {collections.length === 0 ? (
                    <p className="text-xl text-gray-500 text-center">
                        No collections available.
                    </p>
                ) : (
                    collections.map((collection) => (
                        <div
                            key={collection.id}
                            className="p-6 bg-white shadow-lg rounded-xl hover:shadow-2xl transition-all"
                        >
                            <h2 className="text-2xl font-semibold text-gray-700">
                                {collection.name}
                            </h2>
                            <p className="text-lg text-gray-600 mt-2">
                                {collection.sets.length} Flashcard Sets
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                Created by:{" "}
                                {users.find(
                                    (user) => user.id === collection.user.id,
                                )?.username || "Unknown"}
                            </p>

                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() =>
                                        router.push(
                                            `/collections/${collection.id}`,
                                        )
                                    }
                                    className="bg-blue-500 text-white py-2 px-6 rounded-xl shadow-md hover:bg-blue-600 transition-all"
                                >
                                    View Collection
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Page;
