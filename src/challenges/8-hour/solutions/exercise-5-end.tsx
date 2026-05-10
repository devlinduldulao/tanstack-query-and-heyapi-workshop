import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
  postApiV1BooksMutation,
} from "@/api/client/@tanstack/react-query.gen";
import type { Book } from "@/api/client";

export default function Exercise5End() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();
  const queryKey = getApiV1BooksQueryKey();

  const { data } = useSuspenseQuery(getApiV1BooksOptions());

  const mutation = useMutation({
    ...postApiV1BooksMutation(),
    onSuccess: (_created, variables) => {
      const createdBook = variables.body as Book;
      // Bonus: prepend immediately
      queryClient.setQueryData<Book[]>(queryKey, (old) => (old ? [createdBook, ...old] : [createdBook]));
      // Then reconcile with server
      queryClient.invalidateQueries({ queryKey });
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
            if (title) {
              mutation.mutate({
                body: {
                  id: 0,
                  title,
                  description: "",
                  pageCount: 1,
                  excerpt: "",
                  publishDate: new Date().toISOString(),
                },
              });
            }
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
