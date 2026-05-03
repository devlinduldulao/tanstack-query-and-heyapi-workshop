// TODO:
// 1. Replace useQuery with useSuspenseQuery
// 2. Wrap <BooksList /> in <Suspense fallback={...}> + <ErrorBoundary>

import { useQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";

function BooksList() {
  const { data, isPending } = useQuery(getApiV1BooksOptions());
  if (isPending) return <p>Loading…</p>;
  return (
    <ul className="text-sm space-y-1">
      {data?.slice(0, 5).map((b) => (
        <li key={b.id}>{b.title}</li>
      ))}
    </ul>
  );
}

export default function Exercise10() {
  return <BooksList />;
}
