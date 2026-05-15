export default function ChatbotLeadsLoading() {
  return (
    <div className="space-y-5">
      <div className="h-8 w-52 rounded-lg bg-gray-border/60" />
      <div className="rounded-2xl border border-gray-border bg-white p-4">
        <div className="h-10 rounded-lg bg-gray-bg" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-border bg-white">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="grid grid-cols-6 gap-4 border-b border-gray-border p-5 last:border-0">
            {Array.from({ length: 6 }).map((__, cell) => (
              <div key={cell} className="h-4 rounded bg-gray-bg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
