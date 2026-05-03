// TODO:
// 1. Show a Skeleton (boxes) when isPending
// 2. Show "Refreshing…" badge when isFetching && !isPending
// 3. Render error.message + Retry button on isError (calls refetch)
// 4. Add a Refresh button that calls refetch() unconditionally

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Book = { id: number; title: string };

export default function Exercise3() {
  const { data } = useQuery({
    queryKey: ["books-3"],
    queryFn: async () => (await axios.get<Book[]>("https://fakerestapi.azurewebsites.net/api/v1/Books")).data,
  });

  return (
    <div className="text-sm">
      <ul>
        {data?.slice(0, 5).map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}
