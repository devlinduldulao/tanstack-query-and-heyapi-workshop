import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Book = { id: number; title: string; description: string };

const API = "https://fakerestapi.azurewebsites.net/api/v1/Books";

export default function Exercise5End() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["books-5"],
    queryFn: async () => (await axios.get<Book[]>(API)).data,
  });

  const mutation = useMutation({
    mutationFn: async (t: string) => (await axios.post<Book>(API, { title: t, description: "" })).data,
    onSuccess: (created) => {
      // Bonus: prepend immediately
      queryClient.setQueryData<Book[]>(["books-5"], (old) => (old ? [created, ...old] : [created]));
      // Then reconcile with server
      queryClient.invalidateQueries({ queryKey: ["books-5"] });
    },
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
        <button
          onClick={() => {
            if (title) mutation.mutate(title);
            setTitle("");
          }}
          className="rounded border px-3 py-1"
        >
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
