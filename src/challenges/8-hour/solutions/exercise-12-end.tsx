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
      <p className="text-muted-foreground mb-2 text-xs">
        {isFetching ? "Fetching or refreshing..." : "Rendered from warm cache"}
      </p>
      <p className="font-medium">{data.title}</p>
      <p className="mt-1 text-xs opacity-80">{data.description}</p>
    </div>
  );
}

export default function Exercise12End() {
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
              <p className="text-muted-foreground mb-2 text-xs">Fetching or refreshing...</p>
            </div>
          }
        >
          <BookPanel />
        </Suspense>
      )}
    </div>
  );
}
