import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Book = { id: number; title: string };

export default function Exercise3End() {
  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["books-3"],
    queryFn: async () => (await axios.get<Book[]>("https://fakerestapi.azurewebsites.net/api/v1/Books")).data,
  });

  if (isPending) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-muted h-4 w-full animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm">
        <p className="mb-2 text-red-500">{error.message}</p>
        <button onClick={() => refetch()} className="rounded border px-2 py-1 text-xs">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="mb-2 flex items-center justify-between">
        <button onClick={() => refetch()} className="rounded border px-2 py-1 text-xs">
          Refresh
        </button>
        {isFetching && <span className="text-xs opacity-60">Refreshing…</span>}
      </div>
      <ul className="space-y-1">
        {data.slice(0, 5).map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}
