import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const handleClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex items-center justify-center space-x-4 mt-4">
            <button
                onClick={() => handleClick(currentPage - 1)}
                className="px-2 py-2 rounded-md hover:text-blue-800 disabled:text-gray-400 flex-row flex items-center"
                disabled={currentPage === 1}
            >
                <ChevronLeft className="w-5 h-5" />
                <h1>Previous</h1>
            </button>

            <span className="text-lg">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => handleClick(currentPage + 1)}
                className="px-2 py-2 rounded-md hover:text-blue-800 disabled:text-gray-400 flex-row flex items-center"
                disabled={currentPage === totalPages}
            >
                <h1>Next</h1>
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
