// TODO:
// 1. Include page, pageSize, and search in the derived query key.
// 2. Use useDeferredValue(search) before querying.
// 3. Add placeholderData: keepPreviousData.
// 4. Prefetch the next page once you know one exists.

import { useDeferredValue, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";

const PAGE_SIZE = 10;

export default function Exercise6() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const { data, isFetching } = useQuery({
    ...getApiV1BooksOptions(),
    placeholderData: keepPreviousData,
    select: (books) => {
      const filtered = books.filter((book) => book.title?.toLowerCase().includes(deferredSearch.toLowerCase()));
      return {
        items: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        pageCount: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
        total: filtered.length,
      };
    },
  });

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
