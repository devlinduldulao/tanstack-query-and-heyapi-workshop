// TODO:
// 1. Keep the generated getApiV1BooksByIdOptions for the detail panel.
// 2. Mount the detail query only when selectedId != null.
// 3. Use getApiV1BooksQueryKey() for the invalidation button.
// 4. Keep the list select small so components only receive the fields they render.

import { Suspense, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  getApiV1BooksByIdOptions,
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
} from "@/api/client/@tanstack/react-query.gen";
import type { Book } from "@/api/client";

function SelectedBookPanel({ selectedId }: { selectedId: number }) {
  const { data: book } = useSuspenseQuery(getApiV1BooksByIdOptions({ path: { id: selectedId } }));

  return (
    <div>
      <p className="font-medium">{book.title}</p>
      <p className="text-muted-foreground mt-1 text-xs">{book.description}</p>
    </div>
  );
}

export default function Exercise4() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: books = [] } = useSuspenseQuery({
    ...getApiV1BooksOptions(),
    staleTime: 0,
    select: (books: Book[]) =>
      books.slice(0, 8).map((book, index) => ({
        id: book.id ?? index,
        title: book.title ?? "Untitled",
      })),
  });

  return (
    <div className="grid gap-4 text-sm md:grid-cols-2">
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">Books</h3>
          <button
            className="rounded border px-2 py-1 text-xs"
            onClick={() => queryClient.invalidateQueries({ queryKey: getApiV1BooksQueryKey() })}
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
        {selectedId && (
          <Suspense fallback={<p className="text-muted-foreground">Loading selected book...</p>}>
            <SelectedBookPanel selectedId={selectedId} />
          </Suspense>
        )}
      </section>
    </div>
  );
}
