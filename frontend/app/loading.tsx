export default function Loading() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-3 h-5 w-48 rounded bg-slate-700" />
          <div className="mb-2 h-3 w-64 rounded bg-slate-800" />
          <div className="h-3 w-40 rounded bg-slate-800" />
        </div>
      ))}
    </div>
  );
}
