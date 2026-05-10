import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksByIdOptions, getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";

function useBooks() {
  return useSuspenseQuery(getApiV1BooksOptions());
}

function SelectedBookPanel({ selectedId }: { selectedId: number }) {
  const { data: book } = useSuspenseQuery(getApiV1BooksByIdOptions({ path: { id: selectedId } }));

  return (
    <>
      <h3 className="mb-2 font-semibold">{book.title}</h3>
      <p className="text-xs opacity-80">{book.description}</p>
    </>
  );
}

export default function Exercise2End() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: books } = useBooks();

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <ul className="space-y-1">
        {books?.slice(0, 10).map((b) => (
          <li key={b.id}>
            <button
              onClick={() => setSelectedId(b.id ?? null)}
              className={`text-left hover:underline ${selectedId === b.id ? "font-semibold" : ""}`}
            >
              {b.title}
            </button>
          </li>
        ))}
      </ul>
      <aside className="border-l pl-4">
        {!selectedId && <p className="opacity-70">Select a book...</p>}
        {selectedId && (
          <Suspense fallback={<p>Loading...</p>}>
            <SelectedBookPanel selectedId={selectedId} />
          </Suspense>
        )}
      </aside>
    </div>
  );
}
