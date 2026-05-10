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

export default function Exercise1End() {
  const {
    data = [],
    dataUpdatedAt,
    isFetching,
  } = useSuspenseQuery({
    ...getApiV1BooksOptions(),
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: (failureCount) => failureCount < 2,
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
