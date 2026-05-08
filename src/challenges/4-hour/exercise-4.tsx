// TODO:
// 1. Replace the disabled detail query with generated getApiV1BooksByIdOptions.
// 2. Add enabled: selectedId != null.
// 3. Use getApiV1BooksQueryKey() for the invalidation button.
// 4. Keep the list select small so components only receive the fields they render.

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiV1BooksByIdOptions, getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";

export default function Exercise4() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: books = [] } = useQuery({
    ...getApiV1BooksOptions(),
    staleTime: 0,
    select: (books) =>
      books.slice(0, 8).map((book, index) => ({
        id: book.id ?? index,
        title: book.title ?? "Untitled",
      })),
  });

  const detailQuery = useQuery({
    ...getApiV1BooksByIdOptions({ path: { id: selectedId ?? 1 } }),
    enabled: false,
  });

  return (
    <div className="grid gap-4 text-sm md:grid-cols-2">
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">Books</h3>
          <button
            className="rounded border px-2 py-1 text-xs"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["TODO"] })}
          >
            Invalidate list
          </button>
        </div>
        <ul className="space-y-1">
          {books.map((book) => (
            <li key={book.id}>
              <button onClick={() => setSelectedId(book.id)} className="text-left hover:underline">
                {book.title}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-l pl-4">
        <h3 className="mb-2 font-semibold">Selected book</h3>
        {!selectedId && <p className="text-muted-foreground">Select a book to run the generated detail query.</p>}
        {selectedId && !detailQuery.data && (
          <p className="text-muted-foreground">TODO: enable the generated detail query.</p>
        )}
        {detailQuery.data && (
          <div>
            <p className="font-medium">{detailQuery.data.title}</p>
            <p className="text-muted-foreground mt-1 text-xs">{detailQuery.data.description}</p>
          </div>
        )}
      </section>
    </div>
  );
}
