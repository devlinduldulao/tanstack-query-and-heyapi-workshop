import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";

export default function Exercise8End() {
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
        <p className="text-muted-foreground mt-2">Query options: src/api/client/@tanstack/react-query.gen.ts</p>
        <p className="text-muted-foreground mt-2">UI no longer owns URL strings, request functions, or query keys.</p>
      </aside>
    </div>
  );
}
