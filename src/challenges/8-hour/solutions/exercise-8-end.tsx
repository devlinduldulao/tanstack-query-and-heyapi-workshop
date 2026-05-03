import { useQuery } from "@tanstack/react-query";
import { getApiV1Books, type Book } from "@/api/client";

export default function Exercise8End() {
  const {
    data = [],
    isError,
    error,
    isPending,
  } = useQuery({
    queryKey: ["books-sdk"],
    queryFn: async () => {
      const response = await getApiV1Books();
      return response.data ?? [];
    },
  });

  if (isPending) return <p className="text-sm">Loading…</p>;
  if (isError) return <p className="text-sm text-red-500">{error.message}</p>;

  const visibleBooks: Book[] = data.slice(0, 10);

  return (
    <div className="grid gap-4 text-sm md:grid-cols-[1fr_220px]">
      <ul className="space-y-1">
        {visibleBooks.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
      <aside className="rounded border p-3 text-xs">
        <p className="font-semibold">Contract panel</p>
        <p className="mt-2 font-mono">GET /api/v1/Books</p>
        <p className="text-muted-foreground mt-2">SDK: src/api/client/sdk.gen.ts</p>
        <p className="text-muted-foreground mt-2">UI no longer owns URL strings or book DTO definitions.</p>
      </aside>
    </div>
  );
}
