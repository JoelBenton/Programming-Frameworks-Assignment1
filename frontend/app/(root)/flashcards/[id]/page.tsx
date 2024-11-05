'use client';

import { useFlashcardCommentSetData } from '@/components/context/FlashcardCommentSetContext';
import React, { useState, useEffect } from 'react';
import Pagination from '@/components/Pagination';
import { useSession } from '@/components/context/SessionContext';

const FlashcardPage = () => {
  const flashcardSet = useFlashcardCommentSetData();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [canComment, setCanComment] = useState(false);
  const [comments, setComments] = useState(flashcardSet?.comments || []);

  const session = useSession();

  useEffect(() => {
    setCanComment(!!session);
  }, [session]);

  if (!flashcardSet) {
    return <></>;
  }

  const currentCard = flashcardSet.cards[currentCardIndex];

  const handleAddComment = () => {
    if (!session) {
      return
    }
      
    if (newComment.trim()) {
      const updatedComments = [
        ...comments,
        { comment: newComment, author: { id: session.user.id, username: session.user.username, admin: session.user.admin } },
      ];
      setComments(updatedComments);
      setNewComment("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto items-center">
      <h1 className="text-4xl font-bold translate-y-10">Flashcard Set - {flashcardSet.name}</h1>

      <div className="flex pt-14 w-full max-w-7xl space-x-5">
        <div className="flex flex-col justify-center items-center w-full p-10 rounded-3xl shadow-md max-h-[600px]">
          {currentCard ? (
            <div className="relative w-full h-[550px]" onClick={() => setShowAnswer(!showAnswer)}>
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${showAnswer ? 'hidden' : 'opacity-100'} bg-gradient-to-br from-[#ddf8ec] to-[#b3c7f9] p-5 rounded-3xl cursor-pointer`}>
                <p className="text-4xl font-bold text-gray-600">{currentCard.question}</p>
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${showAnswer ? 'opacity-100' : 'hidden'} bg-gradient-to-br from-[#ffebcd] to-[#f08080] p-5 rounded-3xl cursor-pointer`}>
                <p className="text-4xl font-bold text-gray-600">{currentCard.answer}</p>
              </div>
            </div>
          ) : (
            <p className="text-lg font-normal text-gray-500">No cards available in this flashcard set.</p>
          )}

          <Pagination
            currentPage={currentCardIndex + 1}
            totalPages={flashcardSet.cards.length}
            onPageChange={ async (page) => {
              setShowAnswer(false);
              setCurrentCardIndex(page - 1);
            }}
          />
        </div>
      </div>

      <div className="w-full max-w-7xl mt-8">
        <button 
          className="text-blue-500 font-semibold mb-4" 
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
        
        {showComments && (
          <div className={`bg-gradient-to-br ${!showAnswer ? 'from-[#ddf8ec] to-[#b3c7f9]' : 'from-[#ffebcd] to-[#f08080]'} p-5 rounded-xl shadow-inner space-y-4`}>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="p-3 border border-gray-500 rounded-xl last:border-none flex justify-between items-center">
                  <p className="text-gray-700 flex-1 whitespace-pre-line break-words line-clamp-6">
                    {comment.comment}
                  </p>
                  
                  <div className="text-gray-500 flex items-center ml-4">
                    <div className="w-px h-full bg-gray-300 mx-3"></div>
                    <span>{comment.author.username}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments available.</p>
            )}

            {canComment ? (
              <div className="mt-4">
              <textarea
                className='w-full p-3 border rounded-lg text-black resize-none'
                rows={3}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg"
                onClick={() => {handleAddComment()}}
              >
                Submit Comment
              </button>
            </div>
            ) : (<p className='text-black font-bold text-xl'>Login to comment</p>)}
            
          </div>
        )}
      </div>

      <div className="mb-[150px]"></div>
    </div>
  );
};

export default FlashcardPage;