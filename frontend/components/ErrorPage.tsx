import React from 'react';

const ErrorPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-bold text-red-500">Something went wrong</h1>
        <p className="mt-4 text-black">We couldn’t load the flashcard data. Please try again later.</p>
    </div>
);

export default ErrorPage;