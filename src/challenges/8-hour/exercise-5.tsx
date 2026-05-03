// TODO:
// 1. Use useQueryClient()
// 2. In useMutation onSuccess, invalidate ["books-5"]
// 3. Bonus: setQueryData to prepend the new book immediately

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

type Book = { id: number; title: string; description: string };

const API = "https://fakerestapi.azurewebsites.net/api/v1/Books";

export default function Exercise5() {
  const [title, setTitle] = useState("");

  const { data } = useQuery({
    queryKey: ["books-5"],
    queryFn: async () => (await axios.get<Book[]>(API)).data,
  });

  const mutation = useMutation({
    mutationFn: async (t: string) => (await axios.post<Book>(API, { title: t, description: "" })).data,
    // TODO: onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books-5"] })
  });

  return (
    <div className="space-y-3 text-sm">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded border px-2 py-1"
          placeholder="New book title"
        />
        <button onClick={() => mutation.mutate(title)} className="rounded border px-3 py-1">
          Add
        </button>
      </div>
      <ul className="space-y-1">
        {data?.slice(0, 5).map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}
