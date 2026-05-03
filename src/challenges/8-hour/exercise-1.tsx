// TODO:
// 1. Move this anonymous query into reusable queryOptions.
// 2. Include minPages in the query key.
// 3. Pass the AbortSignal to axios.
// 4. Tune staleTime, gcTime, retry, and select for a production list.

import { queryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

type Book = {
  id: number;
  title: string;
  description: string;
  pageCount: number;
};

const BOOKS_URL = "https://fakerestapi.azurewebsites.net/api/v1/Books";
const MIN_PAGES = 200;

const bookCatalogOptions = queryOptions({
  queryKey: ["books", "catalog", { minPages: MIN_PAGES }] as const,
  queryFn: async ({ signal }) => {
    const response = await axios.get<Book[]>(BOOKS_URL, { signal });
    return response.data;
  },
  staleTime: 0,
  gcTime: 5 * 60 * 1000,
  retry: 0,
  select: (books) => books.slice(0, 10),
});

function formatUpdatedAt(timestamp: number) {
  if (!timestamp) return "never";
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}

export default function Exercise1() {
  const { data = [], dataUpdatedAt, error, isError, isFetching, isPending } = useQuery(bookCatalogOptions);

  if (isPending) return <p className="text-sm">Loading catalog…</p>;
  if (isError) return <p className="text-sm text-red-500">{error.message}</p>;

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
