import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiV1BooksByIdOptions } from "@/api/client/@tanstack/react-query.gen";

const WARM_CACHE_TIME = 60 * 1000;

export default function Exercise12End() {
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = useState(false);
  const [prefetchedAt, setPrefetchedAt] = useState<number | null>(null);

  const options = {
    ...getApiV1BooksByIdOptions({ path: { id: 1 } }),
    staleTime: WARM_CACHE_TIME,
  };

  const { data, isFetching } = useQuery({ ...options, enabled });

  return (
    <div className="space-y-3 text-sm">
      <div className="flex gap-2">
        <button
          onClick={async () => {
            await queryClient.prefetchQuery(options);
            setPrefetchedAt(Date.now());
          }}
          className="rounded border px-3 py-1"
        >
          Prefetch book #1
        </button>
        <button onClick={() => setEnabled(true)} className="rounded border px-3 py-1">
          Render
        </button>
        {prefetchedAt && (
          <span className="self-center text-xs opacity-70">
            Cached at {new Intl.DateTimeFormat("en", { minute: "2-digit", second: "2-digit" }).format(prefetchedAt)}
          </span>
        )}
      </div>
      {enabled && (
        <div className="rounded border p-3">
          <p className="text-muted-foreground mb-2 text-xs">
            {isFetching ? "Fetching or refreshing…" : "Rendered from warm cache"}
          </p>
          {data ? (
            <>
              <p className="font-medium">{data.title}</p>
              <p className="mt-1 text-xs opacity-80">{data.description}</p>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
