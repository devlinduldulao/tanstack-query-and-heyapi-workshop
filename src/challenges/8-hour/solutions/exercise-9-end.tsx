import { Suspense, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  getApiV1BooksByIdOptions,
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
} from "@/api/client/@tanstack/react-query.gen";
import { Skeleton } from "@/components/ui/skeleton";

function SelectedBookPanel({ selectedId }: { selectedId: number }) {
  const { data: book, isFetching } = useSuspenseQuery(getApiV1BooksByIdOptions({ path: { id: selectedId } }));

  return (
    <>
      <div className="mb-2 flex items-center gap-2">
        <h3 className="font-semibold">Selected book</h3>
        {isFetching && <span className="text-muted-foreground text-xs">Refreshing...</span>}
      </div>
      <p className="font-medium">{book.title}</p>
      <p className="text-muted-foreground mt-1 text-xs">{book.description}</p>
    </>
  );
}

export default function Exercise9End() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(1);

  const { data: books = [], isFetching } = useSuspenseQuery({
    ...getApiV1BooksOptions(),
    staleTime: 60 * 1000,
    select: (books) =>
      books.slice(0, 8).map((book, index) => ({
        id: book.id ?? index,
        title: book.title ?? "Untitled",
      })),
  });

  return (
    <div className="grid gap-4 text-sm md:grid-cols-2">
      <section>
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="font-semibold">Books</h3>
          <div className="flex items-center gap-2">
            {isFetching && <span className="text-muted-foreground text-xs">Refreshing...</span>}
            <button
              className="rounded border px-2 py-1 text-xs"
              onClick={() => queryClient.invalidateQueries({ queryKey: getApiV1BooksQueryKey() })}
            >
              Invalidate list
            </button>
          </div>
        </div>
        <ul className="space-y-1">
          {books.map((book) => (
            <li key={book.id}>
              <button
                onClick={() => setSelectedId(book.id)}
                className={`text-left hover:underline ${selectedId === book.id ? "font-semibold" : ""}`}
              >
                {book.title}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-l pl-4">
        {selectedId && (
          <Suspense
            fallback={
              // Mirrors SelectedBookPanel: heading row, title, description.
              <>
                <div className="mb-2 flex items-center gap-2">
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-1 h-3 w-3/4" />
              </>
            }
          >
            <SelectedBookPanel selectedId={selectedId} />
          </Suspense>
        )}
      </section>
    </div>
  );
}
