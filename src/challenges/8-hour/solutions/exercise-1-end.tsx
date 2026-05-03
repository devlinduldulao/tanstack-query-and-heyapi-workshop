import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
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
  staleTime: 60 * 1000,
  gcTime: 15 * 60 * 1000,
  retry: (failureCount) => failureCount < 2,
  select: (books) =>
    books
      .filter((book) => book.pageCount >= MIN_PAGES)
      .sort((left, right) => right.pageCount - left.pageCount)
      .slice(0, 10),
});

function formatUpdatedAt(timestamp: number) {
  if (!timestamp) return "never";
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}

export default function Exercise1End() {
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
