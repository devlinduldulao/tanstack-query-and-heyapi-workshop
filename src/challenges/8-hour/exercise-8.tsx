// TODO:
// 1. Delete the hand-written BookPreview type.
// 2. Replace axios + string URL with getApiV1Books from "@/api/client".
// 3. Keep the explicit query key for comparison with generated options in Exercise 9.
// 4. Update the contract panel with what the UI no longer owns.

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type BookPreview = {
  id: number;
  title: string;
};

const BOOKS_URL = "https://fakerestapi.azurewebsites.net/api/v1/Books";

export default function Exercise8() {
  const {
    data = [],
    isError,
    error,
    isPending,
  } = useQuery({
    queryKey: ["books-sdk"],
    queryFn: async () => (await axios.get<BookPreview[]>(BOOKS_URL)).data,
  });

  if (isPending) return <p className="text-sm">Loading…</p>;
  if (isError) return <p className="text-sm text-red-500">{error.message}</p>;

  return (
    <div className="grid gap-4 text-sm md:grid-cols-[1fr_220px]">
      <ul className="space-y-1">
        {data.slice(0, 10).map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
      <aside className="rounded border p-3 text-xs">
        <p className="font-semibold">Contract panel</p>
        <p className="mt-2 font-mono">GET /api/v1/Books</p>
        <p className="text-muted-foreground mt-2">TODO: replace URL + DTO ownership with generated SDK ownership.</p>
      </aside>
    </div>
  );
}
