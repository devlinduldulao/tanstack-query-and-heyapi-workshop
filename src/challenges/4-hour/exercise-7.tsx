// TODO:
// 1. Run npm run update-swagger-bash && npm run openapi-ts before editing the screen.
// 2. Replace the placeholder impact summary with your real observations from the generated diff.
// 3. Mount the generated cover-by-book query only when selectedBookId != null.
// 4. Keep the list and cover panel powered by generated Hey API helpers only.

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";
import type { Book } from "@/api/client";

const syncCommands = [
  "npm run update-swagger-bash",
  "npm run openapi-ts",
  "git diff -- swagger.yaml src/api/client",
  "npm run typecheck",
];

const impactSummary = [
  { label: "Live contract diff", value: "TODO: note the new CoverPhotos paths and schema added to swagger.yaml." },
  { label: "Generated client impact", value: "TODO: list the new generated cover-photo helpers created in src/api/client/." },
  { label: "Frontend action", value: "TODO: explain how the new endpoint changes the UI surface you can now build." },
];

type BookListItem = {
  id: number;
  title: string;
};

export default function Exercise7() {
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
              <p className="text-muted-foreground mt-2">
                TODO: render covers with getApiV1CoverPhotosBooksCoversByIdBookOptions({" "}
                {`{ path: { idBook: selectedBookId } }`}).
              </p>
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