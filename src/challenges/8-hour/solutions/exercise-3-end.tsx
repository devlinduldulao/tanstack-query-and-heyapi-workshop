import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions, getApiV1BooksQueryKey } from "@/api/client/@tanstack/react-query.gen";

export default function Exercise3End() {
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
      <ul className="space-y-1">
        {data.slice(0, 5).map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}
