// TODO:
// 1. Use getApiV1BooksOptions() instead of a hand-written request.
// 2. Let the generated query key come from Hey API.
// 3. Keep the contract panel focused on what the UI no longer owns.
// 4. Remove hand-written DTOs and raw URL strings.

import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";

export default function Exercise8() {
  const { data = [] } = useSuspenseQuery(getApiV1BooksOptions());

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
        <p className="text-muted-foreground mt-2">Hey API now owns the URL, request function, and query key.</p>
      </aside>
    </div>
  );
}
