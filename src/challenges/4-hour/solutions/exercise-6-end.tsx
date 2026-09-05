import { useDeferredValue, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";
import type { Book } from "@/api/client";

const PAGE_SIZE = 10;

// https://react.dev/reference/react/useDeferredValue
function BookResults({ books, search }: { books: Book[]; search: string }) {
  const [page, setPage] = useState(1);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredBooks = books.filter((book) => book.title?.toLowerCase().includes(normalizedSearch));

  const pageCount = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  // Clamp on read rather than trusting state: a background refetch can shrink the result set
  // underneath the current page, and page 4 of a 2-page result must not render empty.
  const safePage = Math.min(page, pageCount);
  const items = filteredBooks.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage(Math.max(1, safePage - 1))}
          disabled={safePage === 1}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-xs opacity-70">
          {filteredBooks.length} matches · Page {safePage} / {pageCount}
        </span>
        <button
          onClick={() => setPage(Math.min(pageCount, safePage + 1))}
          disabled={safePage >= pageCount}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-muted-foreground text-xs">No books match that search.</p>
      ) : (
        <ul className="space-y-1">
          {items.map((book) => (
            <li key={book.id}>{book.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Exercise6End() {
  const [search, setSearch] = useState("");

  // `search` drives the input (urgent). `deferredSearch` drives the results (interruptible).
  const deferredSearch = useDeferredValue(search);
  // The list is still showing results for a term the user has already typed past.
  const isStale = search !== deferredSearch;

  const { data: books, isFetching } = useSuspenseQuery(getApiV1BooksOptions());

  return (
    <div className="space-y-3 text-sm">
      <input
        className="w-full rounded border px-2 py-1"
        placeholder="Search books"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="text-muted-foreground flex justify-end text-xs">{isFetching && <span>refreshing…</span>}</div>
      {/* Stale-content indicator, verbatim from the React docs' useDeferredValue example. The
          0.2s delay before the 0.2s fade is deliberate: on a fast device `isStale` is true for
          about a millisecond, so the dimming never fires and the user sees no flicker. Throttle
          the CPU (DevTools → Performance → CPU 6x) and it appears. */}
      <div
        style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? "opacity 0.2s 0.2s linear" : "opacity 0s 0s linear",
        }}
      >
        {/* `key` resets paging to page 1 whenever the deferred search term changes, with no
            setPage on the urgent path and no resync effect.
            https://react.dev/learn/preserving-and-resetting-state */}
        <BookResults key={deferredSearch} books={books} search={deferredSearch} />
      </div>
    </div>
  );
}
