'use client';

export default function GlobalError({
  error,
}: {
  error: Error;
}) {
  return (
    <html>
      <body className="bg-black text-white flex items-center justify-center min-h-screen">
        <div>
          <h1 className="text-4xl text-red-500 font-bold">
            Global Error
          </h1>

          <p className="mt-4">
            {error.message}
          </p>
        </div>
      </body>
    </html>
  );
}