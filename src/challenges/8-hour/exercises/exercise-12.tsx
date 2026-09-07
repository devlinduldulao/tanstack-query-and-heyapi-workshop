// TODO:
// 1. Keep the same generated options object for the rendered suspense query.
// 2. Remove manual prefetching and let the query run only when the panel mounts.
// 3. Show the difference between the first load and a background refetch on remount.
// 4. Map this shared-options pattern to a TanStack Router loader when preloading is desired.

import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksByIdOptions } from "@/api/client/@tanstack/react-query.gen";
import { Skeleton } from "@/components/ui/skeleton";

function BookPanel() {
  const { data } = useSuspenseQuery(getApiV1BooksByIdOptions({ path: { id: 1 } }));

  return (
    <div className="rounded border p-3">
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
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          }
        >
          <BookPanel />
        </Suspense>
      )}
    </div>
  );
}
