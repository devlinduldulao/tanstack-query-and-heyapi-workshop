import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";

function BooksList() {
  const { data } = useSuspenseQuery(getApiV1BooksOptions());
  return (
    <ul className="text-sm space-y-1">
      {data.slice(0, 5).map((b) => (
        <li key={b.id}>{b.title}</li>
      ))}
    </ul>
  );
}

export default function Exercise10End() {
  return (
    <ErrorBoundary fallback={<p className="text-red-500">Failed to load.</p>}>
      <Suspense fallback={<p className="text-sm opacity-70">Loading…</p>}>
        <BooksList />
      </Suspense>
    </ErrorBoundary>
  );
}
