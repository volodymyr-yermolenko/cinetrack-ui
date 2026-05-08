"use client";

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold">An unexpected error has occurred.</h1>
      <p>Please try again later or contact support if the issue persists.</p>
      <details className="mt-4 p-4 bg-gray-100 rounded">
        <summary className="cursor-pointer">Error Details</summary>
        <pre className="mt-2 text-sm text-red-600">{error.message}</pre>
      </details>
    </div>
  );
}
