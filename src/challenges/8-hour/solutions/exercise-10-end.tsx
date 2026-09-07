import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";
import { Skeleton } from "@/components/ui/skeleton";

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
      <Suspense
        fallback={
          // Same five rows the resolved list renders, so nothing shifts on swap.
          <ul className="space-y-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index}>
                <Skeleton className="h-4 w-56" />
              </li>
            ))}
          </ul>
        }
      >
        <BooksList />
      </Suspense>
    </ErrorBoundary>
  );
}
