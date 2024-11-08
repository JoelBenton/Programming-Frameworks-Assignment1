'use client';

import { useFlashcardCommentSetData } from '@/components/context/FlashcardCommentSetContext';
import React, { useState, useEffect } from 'react';
import Pagination from '@/components/Pagination';
import { useSession } from '@/components/context/SessionContext';
import { useRouter } from 'next/navigation';

const FlashcardPage = () => {
  const flashcardSet = useFlashcardCommentSetData();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [canComment, setCanComment] = useState(false);
  const [comments, setComments] = useState(flashcardSet?.comments || []);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitComment, setSubmitComment] = useState(false);

  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    setCanComment(!!session);
  }, [session]);

  useEffect(() => {
    if (submitComment) {
      const postComment = async () => {
        try {
          console.log(session?.user.id != flashcardSet?.user_id)
          if (!canComment && session?.user.id != flashcardSet?.user_id) {
            setErrorMessage('Please sign in to send Comment')
            return
          }
          if (!session) {
            setErrorMessage('Please sign in to send Comment')
            return
          }
          if (!flashcardSet) {
            setErrorMessage('Failed to retrieve Flashcard Set information! Refresh page and try again.')
            return
          }
          const response = await fetch(`http://localhost:3333/api/set/${flashcardSet.id}/comment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user.token}`,
            },
            body: JSON.stringify({
              message: newComment,
              user_id: session?.user.id,
            }),
          });
    
          if (!response.ok) {
            setErrorMessage('Failed to post comment. Please try again later.');
            console.error('Failed to post comment:', await response.text());
          } else {
            setComments((prevComments) => [
              ...prevComments,
              { comment: newComment, author: { id: session.user.id, username: session.user.username, admin: session.user.admin } },
            ]);
            setNewComment("");
          }
        } catch (error) {
          setErrorMessage('An error occurred while posting the comment.');
          console.error('Error posting comment:', error);
        } finally {
          setSubmitComment(false);
        }
      };

      postComment();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitComment, newComment, session]);

  if (!flashcardSet) {
    router.back()
    return
  }

  const handleEditRedirect = () => {
    router.push(`/flashcards/${flashcardSet.id}/edit`)
  }

  const handleAddComment = () => {
    if (!session) {
      setErrorMessage('You need to be logged in to comment.');
      return;
    }

    if (newComment.trim()) {
      setSubmitComment(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Comment cannot be empty.');
    }
  };

  const currentCard = flashcardSet.cards[currentCardIndex];

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
          <button
            className="text-blue-500 font-semibold mt-4"
            onClick={handleEditRedirect}
          >
            Edit Flashcard Set
          </button>
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

            {canComment && session?.user.id !== flashcardSet?.user_id ? (
              <div className="mt-4">
                <textarea
                  className="w-full p-3 border rounded-lg text-black resize-none"
                  rows={3}
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg"
                  onClick={handleAddComment}
                >
                  Submit Comment
                </button>
              </div>
            ) : (session?.user.id === flashcardSet?.user_id ? <p></p> : <p className="text-black font-bold text-xl">Login to comment</p>)}
          </div>
        )}
      </div>

      <div className="mb-[150px]"></div>
    </div>
  );
};

export default FlashcardPage;