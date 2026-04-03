"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-bold text-red-400">Something went wrong</h1>
      <p className="mt-3 text-sm text-slate-400">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-amber-400 px-5 py-2 font-semibold text-slate-950 transition hover:bg-amber-300"
      >
        Try Again
      </button>
    </div>
  );
}
