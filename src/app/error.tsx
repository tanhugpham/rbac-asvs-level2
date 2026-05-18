'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-red-500 mb-4">
        Something went wrong
      </h1>

      <p className="text-zinc-400 mb-6">
        {error.message}
      </p>

      <button
        onClick={() => reset()}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
      >
        Try Again
      </button>
    </div>
  );
}