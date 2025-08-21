export default function LoadingEmotions() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="h-8 w-72 rounded bg-gray-100" />
      <div className="mt-2 h-5 w-96 rounded bg-gray-100" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-6 w-6 rounded bg-gray-100" />
              <div className="h-3 w-16 rounded bg-gray-100" />
            </div>
            <div className="mt-3 h-5 w-40 rounded bg-gray-100" />
            <div className="mt-2 h-4 w-full rounded bg-gray-100" />
            <div className="mt-1 h-4 w-5/6 rounded bg-gray-100" />
            <div className="mt-4 flex gap-2">
              <div className="h-5 w-16 rounded-full bg-gray-100" />
              <div className="h-5 w-14 rounded-full bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
