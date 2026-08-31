'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-950/20">
      <div className="text-center p-8 bg-slate-800 rounded-xl border border-red-500/30">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Something went wrong
        </h1>
        <p className="text-slate-300 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="bg-red-600/80 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
