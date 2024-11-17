"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import { useSession } from "@/components/context/SessionContext";
import { setsInput } from "@/validators/sets";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { FlashcardSet } from "@/lib/definitions";
import { sleep } from "@/lib/utils";

const Page = () => {
    const { session } = useSession() || {};

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
                    to create Flashcards
                </p>
            </div>
        );
    }

    const [title, setTitle] = useState("");
    const [cards, setCards] = useState(
        Array(5).fill({ question: "", answer: "", difficulty: "medium" }),
    );
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [validatedData, setValidatedData] = useState<FlashcardSet | null>(
        null,
    );

    const router = useRouter();

    const handleCardChange = (index: number, field: string, value: string) => {
        setError(null);
        const newCards = [...cards];
        newCards[index] = { ...newCards[index], [field]: value };
        setCards(newCards);
    };

    const handleDeleteCard = (index: number) => {
        const newCards = cards.filter((_, i) => i !== index);
        setCards(newCards);
    };

    const addNewCard = () => {
        setCards([...cards, { question: "", answer: "", difficulty: "easy" }]);
    };

    const handleCreateCard = () => {
        setLoading(true);
        const nonEmptyCards = cards.filter(
            (card) => card.question.trim() != "" && card.answer.trim() != "",
        );
        if (nonEmptyCards.length === 0) {
            setError(
                "Please complete at least one flashcard before submitting.",
            );
            setLoading(false);
            return;
        }

        if (!session) {
            setError("An error has occurred. Please try again later.");
            setLoading(false);
            return;
        }
        setError(null); // Clear error if at least one card exists

        const result = setsInput.safeParse({
            name: title,
            user_id: session.user.id,
            cards: nonEmptyCards,
        });

        if (!result.success) {
            const errorMessages = result.error.errors.reduce(
                (messages, err) => {
                    if (err.path[0] === "name") {
                        messages.push("Title must be at least 3 characters.");
                    } else if (
                        err.path[0] === "cards" &&
                        err.path[2] === "difficulty"
                    ) {
                        if (
                            !messages.some((msg) =>
                                msg.includes(
                                    "Difficulty must be 'easy', 'medium', or 'hard'",
                                ),
                            )
                        ) {
                            messages.push(
                                "Difficulty must be 'easy', 'medium', or 'hard' for all cards.",
                            );
                        }
                    } else {
                        messages.push(`${err.path.join(".")} - ${err.message}`);
                    }
                    return messages;
                },
                [] as string[],
            );

            setError(errorMessages.join(" "));
            setLoading(false);
            return;
        }

        setValidatedData(result.data as FlashcardSet);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!loading || !validatedData) return;

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL_BASE}/api/sets`,
                    {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                            Authorization: `Bearer ${session?.user.token}`,
                        },
                        body: JSON.stringify(validatedData),
                    },
                );

                if (response.ok) {
                    await sleep(400);
                    router.push(`/`);
                } else if (response.status === 403) {
                    setError(
                        "User not authorised to make Flashcard Sets! Please login first.",
                    );
                } else if (response.status === 429) {
                    setError(
                        "Maximum number of sets have been created today! Try again tomorrow",
                    );
                }
            } catch (error) {
                console.log(error);
                setError("Unexpected Error : Error - " + error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, validatedData]);

    return (
        <div className="flex justify-center items-start min-h-screen py-10 overflow-auto">
            <div className="flex w-3/5 h-full flex-col items-start p-6 shadow-xl rounded-3xl">
                <div className="p-3 pt-10 w-full pb-10 text-4xl font-bold">
                    Create a new flashcard set
                </div>

                <input
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#ddf8ec] to-[#b3c7f9] text-black p-2"
                    placeholder='Enter a title, like "Geography"'
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />

                <div className="p-3 pt-10 text-4xl font-bold">Cards</div>

                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="w-full bg-gradient-to-br from-[#c2e0d3] to-[#b3c7f9] rounded-xl shadow-xl p-4 my-4"
                    >
                        <div className="flex items-center justify-between">
                            <input
                                className="w-[38%] h-10 text-black p-2 mb-1 bg-transparent placeholder:text-gray-500 border-b-2 border-gray-400 focus:border-violet-500 outline-none"
                                placeholder={`Question for card ${index + 1}`}
                                value={card.question}
                                onChange={(event) =>
                                    handleCardChange(
                                        index,
                                        "question",
                                        event.target.value,
                                    )
                                }
                            />
                            <input
                                className="w-[38%] h-10 text-black p-2 mb-1 bg-transparent border-b-2 placeholder:text-gray-500 border-gray-400 focus:border-violet-500 outline-none"
                                placeholder={`Answer for card ${index + 1}`}
                                value={card.answer}
                                onChange={(event) =>
                                    handleCardChange(
                                        index,
                                        "answer",
                                        event.target.value,
                                    )
                                }
                            />
                            <select
                                className="w-[14%] h-10 p-2 rounded-xl bg-gradient-to-r from-[#ddf8ec] to-[#b3c7f9] text-black outline-none"
                                value={card.difficulty}
                                onChange={(event) =>
                                    handleCardChange(
                                        index,
                                        "difficulty",
                                        event.target.value,
                                    )
                                }
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            <Trash2Icon
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                onClick={() => handleDeleteCard(index)}
                            />
                        </div>
                    </div>
                ))}

                {error && <div className="text-red-500 mt-2">{error}</div>}

                <button
                    className="w-full h-10 rounded-xl bg-blue-500 text-white p-2 mt-4"
                    onClick={addNewCard}
                >
                    Add a new card
                </button>

                <div className="flex justify-center mt-4 w-full">
                    <button
                        onClick={handleCreateCard}
                        className="w-[200px] h-10 rounded-xl bg-blue-500 text-white p-2"
                    >
                        Create Flashcard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;
