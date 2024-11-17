import React from "react";
import { FlashcardSet, User } from "@/lib/definitions";

interface ModalProps {
    flashcardSets: FlashcardSet[];
    users: User[];
    onSelect: (selectedSet: FlashcardSet) => void;
    onClose: () => void;
}

const FlashcardSetModal: React.FC<ModalProps> = ({
    flashcardSets,
    users,
    onSelect,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
            <div className="rounded-xl shadow-xl p-6 w-full max-w-md bg-gradient-to-br from-[#1c1c4d] to-[#7b5eb3] text-white">
                <h2 className="text-lg font-bold mb-4">
                    Select a Flashcard Set
                </h2>
                <ul className="space-y-4">
                    {flashcardSets.map((set) => {
                        const user = users.find(
                            (user) => user.id === set.user_id,
                        );
                        return (
                            <li
                                key={set.id}
                                className="p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 cursor-pointer transition duration-200"
                                onClick={() => onSelect(set)}
                            >
                                <h3 className="text-md font-semibold">
                                    {set.name}
                                </h3>
                                <h4 className="text-sm font-medium text-gray-300 mt-2">
                                    Cards: {set.cards.length}
                                </h4>
                                <p className="text-sm text-gray-300">
                                    Author: {user ? user.username : "Unknown"}
                                </p>
                            </li>
                        );
                    })}
                </ul>
                <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition duration-200"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default FlashcardSetModal;
