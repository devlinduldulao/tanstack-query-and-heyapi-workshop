import { useDeferredValue, useEffect, useState } from "react";
import {
  keepPreviousData,
  type QueryFunction,
  type QueryKey,
  type UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";
import type { Book } from "@/api/client";

const PAGE_SIZE = 10;

type BooksPage = {
  items: Book[];
  page: number;
  pageCount: number;
  total: number;
};

function booksPageOptions(page: number, search: string): UseQueryOptions<Book[], Error, BooksPage, QueryKey> {
  const normalizedSearch = search.trim().toLowerCase();
  const baseOptions = getApiV1BooksOptions();

  return {
    queryFn: baseOptions.queryFn as QueryFunction<Book[], QueryKey>,
    queryKey: [...baseOptions.queryKey, "page", { page, pageSize: PAGE_SIZE, search: normalizedSearch }],
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    select: (books): BooksPage => {
      const filtered = books.filter((book) => book.title?.toLowerCase().includes(normalizedSearch));
      const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      return {
        items: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        page,
        pageCount,
        total: filtered.length,
      };
    },
  };
}

export default function Exercise13End() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const { data, isFetching } = useQuery(booksPageOptions(page, deferredSearch));

  useEffect(() => {
    if (!data || page >= data.pageCount) return;
    queryClient.prefetchQuery(booksPageOptions(page + 1, deferredSearch));
  }, [data, deferredSearch, page, queryClient]);

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
