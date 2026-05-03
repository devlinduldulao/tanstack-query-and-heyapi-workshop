// TODO:
// 1. Wire the Prefetch button to queryClient.prefetchQuery(bookOptions).
// 2. Keep the same generated options object for the rendered query.
// 3. Show the difference between warm cache and background refetch.
// 4. Map this component pattern to a TanStack Router loader with ensureQueryData.

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiV1BooksByIdOptions } from "@/api/client/@tanstack/react-query.gen";

const WARM_CACHE_TIME = 60 * 1000;

export default function Exercise12() {
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = useState(false);
  const [prefetchedAt, setPrefetchedAt] = useState<number | null>(null);

  const bookOptions = {
    ...getApiV1BooksByIdOptions({ path: { id: 1 } }),
    staleTime: WARM_CACHE_TIME,
  };

  const { data, isFetching } = useQuery({ ...bookOptions, enabled });

  return (
    <div className="space-y-3 text-sm">
      <div className="flex gap-2">
        <button
          onClick={() => {
            void queryClient.prefetchQuery(bookOptions).then(() => setPrefetchedAt(Date.now()));
          }}
          className="rounded border px-3 py-1"
        >
          Prefetch book #1
        </button>
        <button onClick={() => setEnabled(true)} className="rounded border px-3 py-1">
          Render
        </button>
        {prefetchedAt && <span className="text-muted-foreground self-center text-xs">Warm cache ready</span>}
      </div>
      {enabled && (
        <div className="rounded border p-3">
          <p className="text-muted-foreground text-xs">
            {isFetching ? "Fetching or refreshing…" : "Rendered from cache"}
          </p>
          {data && (
            <div className="mt-2">
              <p className="font-medium">{data.title}</p>
              <p className="text-muted-foreground mt-1 text-xs">{data.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
