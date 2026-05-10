import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getApiV1BooksOptions,
  getApiV1CoverPhotosBooksCoversByIdBookOptions,
} from "@/api/client/@tanstack/react-query.gen";
import type { Book } from "@/api/client";

const syncCommands = [
  "npm run update-swagger-bash",
  "npm run openapi-ts",
  "git diff -- swagger.yaml src/api/client",
  "npm run typecheck",
];

const impactSummary = [
  {
    label: "Live contract diff",
    value: "The backend added a new CoverPhotos resource, including list, detail, create, update, delete, and by-book endpoints.",
  },
  {
    label: "Generated client impact",
    value: "Hey API generated a new CoverPhoto type plus SDK, TanStack Query, barrel, and Zod helpers for the new endpoints.",
  },
  {
    label: "Frontend action",
    value: "The UI can now ship a cover explorer immediately by composing the generated books list with the generated cover-by-book query.",
  },
];

type BookListItem = {
  id: number;
  title: string;
};

function SelectedBookCoversPanel({ selectedBookId }: { selectedBookId: number }) {
  const { data: covers } = useSuspenseQuery(
    getApiV1CoverPhotosBooksCoversByIdBookOptions({ path: { idBook: selectedBookId } }),
  );

  return (
    <div className="mt-2 space-y-2">
      {covers.length === 0 ? (
        <p className="text-muted-foreground">No covers returned for this book.</p>
      ) : (
        <ul className="space-y-2">
          {covers.map((cover) => (
            <li key={cover.id ?? cover.url} className="rounded border p-2">
              <p className="font-medium">Cover #{cover.id ?? "unknown"}</p>
              <p className="text-muted-foreground mt-1 break-all text-xs">{cover.url ?? "No URL returned"}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="text-muted-foreground text-xs">This panel mounts only after selection, so the related-cover query stays conditional without hand-written fetch logic.</p>
    </div>
  );
}

export default function Exercise14End() {
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const { data: books } = useSuspenseQuery({
    ...getApiV1BooksOptions(),
    select: (items: Book[]): BookListItem[] =>
      items.slice(0, 8).map((book, index) => ({
        id: book.id ?? index + 1,
        title: book.title ?? `Book ${book.id ?? index + 1}`,
      })),
  });

  return (
    <div className="grid gap-4 text-sm lg:grid-cols-[minmax(0,1fr)_280px]">
      <section className="space-y-4">
        <div className="rounded border p-3">
          <h3 className="font-semibold">Contract sync checklist</h3>
          <ol className="mt-2 space-y-1 text-xs opacity-80">
            {syncCommands.map((command) => (
              <li key={command} className="font-mono">
                {command}
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <section className="rounded border p-3">
            <h3 className="mb-2 font-semibold">Generated books list</h3>
            <ul className="space-y-1">
              {books.map((book) => (
                <li key={book.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedBookId(book.id)}
                    className="hover:bg-muted w-full rounded px-2 py-1 text-left"
                  >
                    {book.title}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded border p-3">
            <h3 className="font-semibold">Selected book covers</h3>
            {!selectedBookId ? (
              <p className="text-muted-foreground mt-2">Select a book to mount the generated cover-photo query.</p>
            ) : (
              <Suspense fallback={<p className="text-muted-foreground mt-2">Loading selected book covers...</p>}>
                <SelectedBookCoversPanel selectedBookId={selectedBookId} />
              </Suspense>
            )}
          </section>
        </div>
      </section>

      <aside className="space-y-4 rounded border p-3 text-xs">
        <div>
          <p className="font-semibold">Impact report</p>
          <ul className="mt-2 space-y-2">
            {impactSummary.map((item) => (
              <li key={item.label}>
                <p className="font-medium">{item.label}</p>
                <p className="text-muted-foreground mt-1">{item.value}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold">Generated touch points</p>
          <ul className="text-muted-foreground mt-2 space-y-1 font-mono">
            <li>swagger.yaml</li>
            <li>openapi-ts.config.ts</li>
            <li>src/api/client/@tanstack/react-query.gen.ts</li>
            <li>src/api/client/types.gen.ts</li>
            <li>src/api/client/zod.gen.ts</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}