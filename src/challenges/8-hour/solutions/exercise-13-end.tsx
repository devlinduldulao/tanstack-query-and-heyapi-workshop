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

export default function Exercise13End() {
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
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-xs opacity-70">
          {data?.total ?? 0} matches · Page {page} / {data?.pageCount ?? 1} {isFetching && "· refreshing…"}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(data?.pageCount ?? 1, p + 1))}
          disabled={page >= (data?.pageCount ?? 1)}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <ul className="space-y-1">
        {data?.items.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}
