// TODO:
// 1. Show a suspense fallback when the list is cold.
// 2. Show a "Refreshing..." badge when isFetching.
// 3. Add an error fallback with a retry affordance at the nearest boundary.
// 4. Add a Refresh button that invalidates the query unconditionally.

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions, getApiV1BooksQueryKey } from "@/api/client/@tanstack/react-query.gen";

export default function Exercise3() {
  const queryClient = useQueryClient();
  const { data, isFetching } = useSuspenseQuery(getApiV1BooksOptions());

  return (
    <div className="text-sm">
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => void queryClient.invalidateQueries({ queryKey: getApiV1BooksQueryKey() })}
          className="rounded border px-2 py-1 text-xs"
        >
          Refresh
        </button>
        {isFetching && <span className="text-xs opacity-60">Refreshing...</span>}
      </div>
      <ul>
        {data.slice(0, 5).map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}
