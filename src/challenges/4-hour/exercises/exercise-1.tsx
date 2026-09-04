// TODO:
// 1. Start from getApiV1BooksOptions() instead of a hand-written request.
// 2. Keep the generated query key and derive the filtered catalog with select.
// 3. Tune staleTime, gcTime, and retry for a production list.
// 4. Let Hey API own the transport layer and DTO shape.

import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";
const MIN_PAGES = 200;

function formatUpdatedAt(timestamp: number) {
  if (!timestamp) return "never";
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}

export default function Exercise1() {
  const {
    data = [],
    dataUpdatedAt,
    isFetching,
  } = useSuspenseQuery({
    ...getApiV1BooksOptions(),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    retry: 0,
    select: (books) =>
      books
        .filter((book) => (book.pageCount ?? 0) >= MIN_PAGES)
        .sort((left, right) => (right.pageCount ?? 0) - (left.pageCount ?? 0))
        .slice(0, 10),
  });

  return (
    <div className="space-y-3 text-sm">
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>Updated: {formatUpdatedAt(dataUpdatedAt)}</span>
        {isFetching && <span>Refreshing in background…</span>}
      </div>
      <ul className="space-y-1">
        {data.map((book) => (
          <li key={book.id} className="flex justify-between gap-3 border-b py-1">
            <span>{book.title}</span>
            <span className="text-muted-foreground">{book.pageCount} pages</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
