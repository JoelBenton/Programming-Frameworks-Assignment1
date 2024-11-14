"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";

import { FlashcardSet as FlashcardType } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { useFlashcardSetsData } from "@/components/context/FlashcardSetsContext";
import Flashcard from "@/components/Flashcard";
import ErrorPage from "@/components/ErrorPage";
import { useUsers } from "@/components/context/UsersContext";
import { useSession } from "@/components/context/SessionContext";

export default function Home() {
  const userContext = useUsers();
  const sessionContext = useSession();
  const flashcardSetsContext = useFlashcardSetsData();

  const session = sessionContext.session
  const flashcardSets = flashcardSetsContext.flashcardSets || []
  const users = userContext?.users || []

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    flashcardSetsContext.loadFlashcards('all')
  }, [session, flashcardSetsContext.loadFlashcards])

  const router = useRouter();

  if (!flashcardSets || !users) {
    return <ErrorPage />;
  }

  const loadedFlashcards: FlashcardType[] = flashcardSets.map((flashcard) => ({
    ...flashcard,
    created_at: new Date(flashcard.created_at),
    updated_at: new Date(flashcard.updated_at),
  }));

  const [selectedFlashcard, setSelectedFlashcard] =
    useState<FlashcardType | null>(
      loadedFlashcards.length > 0 ? loadedFlashcards[0] : null
    );

  // Set how many items to display per page
  const itemsPerPage = 5;

  // Calculate total pages whenever flashcards or itemsPerPage change
  useEffect(() => {
    const totalFlashcards = loadedFlashcards.length;
    setTotalPages(Math.ceil(totalFlashcards / itemsPerPage));
  }, [flashcardSets, itemsPerPage, loadedFlashcards.length]);

  // Calculate which flashcards to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFlashcards = loadedFlashcards.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviewCards = (flashcardData: FlashcardType) => {
    setSelectedFlashcard(flashcardData);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-y-auto items-center">
      <h1 className="text-4xl font-bold translate-y-10">Flashcard Sets</h1>

      <div className="flex pt-14 w-full max-w-7xl space-x-5">
        <div className="flex flex-col justify-start w-1/2 space-y-5">
          {loadedFlashcards.length > 0 ? (
            <>
              {currentFlashcards.map((flashcard, index) => (
                <Flashcard
                  key={index}
                  flashcard={flashcard}
                  user={
                    users.find((user) => user.id === flashcard.user_id) || {
                      id: 0,
                      username: "UserNotFound",
                      admin: false,
                    }
                  }
                  onSubmit={handlePreviewCards}
                />
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p className="text-lg font-normal text-gray-500">
              No flashcards available. Please add some flashcards to get
              started.
            </p>
          )}
        </div>
        {/* Sidebar box next to the flashcards */}
        <div className="w-full bg-gradient-to-br from-[#ddf8ec] to-[#b3c7f9] p-10 rounded-3xl shadow-md max-h-[1000px] overflow-y-auto">
          {selectedFlashcard ? (
            <div>
              <div className="flex flex-row w-full justify-between items-center">
                <p className="text-6xl font-bold mb-2 text-gray-500">
                  {selectedFlashcard.name}
                </p>
                <button
                  onClick={() => {
                    router.push(`/flashcards/${selectedFlashcard.id}`);
                  }}
                  className="flex items-center h-1/2 p-1 bg-[#b3c7f9] border-gray-600 border-2 text-white px-4 rounded-xl hover:bg-[#8aabfe]"
                >
                  Study
                </button>
              </div>
              <p className="text-lg font-normal mb-2 text-gray-500">
                Created - {selectedFlashcard.created_at.toLocaleString()}
              </p>
              <p className="text-lg font-normal mb-2 text-gray-500">
                Last updated - {selectedFlashcard.updated_at.toLocaleString()}
              </p>
              <hr className="my-4 border-gray-500" />
              {selectedFlashcard.cards.map((card, index) => (
                <div key={index} className="mb-4">
                  <p className="text-3xl font-bold text-gray-400">
                    {card.question}
                  </p>
                  <p className="text-xl text-gray-500">{card.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-black">No flashcard selected.</p>
          )}
        </div>
      </div>
      <div className="mb-[150px]"></div>
    </div>
  );
}
