// TODO:
// 1. Keep the same generated options object for the rendered suspense query.
// 2. Remove manual prefetching and let the query run only when the panel mounts.
// 3. Show the difference between the first load and a background refetch on remount.
// 4. Map this shared-options pattern to a TanStack Router loader when preloading is desired.

import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksByIdOptions } from "@/api/client/@tanstack/react-query.gen";

const WARM_CACHE_TIME = 60 * 1000;

function getBookOptions() {
  return {
    ...getApiV1BooksByIdOptions({ path: { id: 1 } }),
    staleTime: WARM_CACHE_TIME,
  };
}

function BookPanel() {
  const { data, isFetching } = useSuspenseQuery(getBookOptions());

  return (
    <div className="rounded border p-3">
      <p className="text-muted-foreground text-xs">
        {isFetching ? "Fetching or refreshing..." : "Rendered from cache"}
      </p>
      <div className="mt-2">
        <p className="font-medium">{data.title}</p>
        <p className="text-muted-foreground mt-1 text-xs">{data.description}</p>
      </div>
    </div>
  );
}

export default function Exercise12() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-3 text-sm">
      <div className="flex gap-2">
        <button onClick={() => setEnabled(true)} className="rounded border px-3 py-1">
          Render book #1
        </button>
      </div>
      {enabled && (
        <Suspense
          fallback={
            <div className="rounded border p-3">
              <p className="text-muted-foreground text-xs">Fetching or refreshing...</p>
            </div>
          }
        >
          <BookPanel />
        </Suspense>
      )}
    </div>
  );
}
