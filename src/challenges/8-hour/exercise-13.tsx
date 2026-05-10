// TODO:
// 1. Start from getApiV1BooksOptions() so Hey API owns the request and query key.
// 2. Use useDeferredValue(search) before deriving the visible items.
// 3. Keep paging local because the API call is still the generated books list query.
// 4. Remove manual prefetching and let one shared query feed the derived UI state.

import { useDeferredValue, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";
import type { Book } from "@/api/client";

const PAGE_SIZE = 10;

type BooksPage = {
  items: Book[];
  pageCount: number;
  total: number;
};

export default function Exercise13() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const { data: books, isFetching } = useSuspenseQuery(getApiV1BooksOptions());
  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const filteredBooks = books.filter((book) => book.title?.toLowerCase().includes(normalizedSearch));
  const data: BooksPage = {
    items: filteredBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    pageCount: Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE)),
    total: filteredBooks.length,
  };

  return (
    <div className="space-y-3 text-sm">
      <input
        className="w-full rounded border px-2 py-1"
        placeholder="Search books"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
      />
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>{data?.total ?? 0} matches</span>
        <span>
          Page {page} / {data?.pageCount ?? 1} {isFetching && "· refreshing…"}
        </span>
      </div>
      <ul className="space-y-1">
        {data?.items.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
      <div className="flex justify-between">
        <button
          className="rounded border px-3 py-1"
          disabled={page === 1}
          onClick={() => setPage((value) => value - 1)}
        >
          Prev
        </button>
        <button
          className="rounded border px-3 py-1"
          disabled={page >= (data?.pageCount ?? 1)}
          onClick={() => setPage((value) => value + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
