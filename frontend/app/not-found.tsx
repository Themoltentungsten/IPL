import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-5xl font-bold text-amber-300">404</h1>
      <p className="mt-3 text-lg text-slate-300">Page not found</p>
      <p className="mt-1 text-sm text-slate-400">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="mt-6 rounded-lg bg-amber-400 px-5 py-2 font-semibold text-slate-950 transition hover:bg-amber-300">
        Back to Home
      </Link>
    </div>
  );
}
