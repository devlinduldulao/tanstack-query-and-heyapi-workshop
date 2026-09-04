// TODO:
// 1. Show a suspense fallback when the list is cold.
// 2. Show a "Refreshing..." badge when isFetching.
// 3. Add an error fallback with a retry affordance at the nearest boundary.
// 4. Add a Refresh button that invalidates the query unconditionally.

import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";

export default function Exercise3() {
  const { data } = useSuspenseQuery(getApiV1BooksOptions());

  return (
    <div className="text-sm">
      <ul>
        {data.slice(0, 5).map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}
