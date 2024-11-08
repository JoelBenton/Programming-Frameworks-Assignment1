import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FlashcardSet, User } from "@/lib/definitions";

interface FlashcardProps {
  flashcard: FlashcardSet,
  user: User,
  onSubmit: (data: FlashcardSet) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  flashcard,
  user,
  onSubmit,
}) => {
  const handlePreview = () => {
    onSubmit(flashcard);
  };
  return (
    <div className="p-3 w-full"> 
      <Card className="bg-gradient-to-br from-[#c2e0d3] to-[#b3c7f9] rounded-xl shadow-xl p-4 transition-transform transform hover:scale-105 relative">
        <CardContent className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">{flashcard.name}</h2>
          <div className="bg-gray-500 rounded-full px-4 py-1 text-sm text-center font-medium">
            {flashcard.cards.length} Cards
          </div>
          <div className="p-2 pt-4">
            <p className="text-gray-500 mt-auto absolute bottom-4 left-4">{user?.username}</p> 
            <button onClick={handlePreview} className="absolute bottom-4 right-4 bg-[#b3c7f9] border-gray-600 border-2 text-white px-4 rounded hover:bg-[#8aabfe] transition h-8">
              Preview
            </button>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default Flashcard;