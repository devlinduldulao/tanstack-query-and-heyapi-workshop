// TODO:
// 1. Use useQueryClient()
// 2. In useMutation onSuccess, invalidate getApiV1BooksQueryKey().
// 3. Bonus: setQueryData to prepend the new book immediately.

import { useState } from "react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions, postApiV1BooksMutation } from "@/api/client/@tanstack/react-query.gen";

export default function Exercise5() {
  const [title, setTitle] = useState("");

  const { data } = useSuspenseQuery(getApiV1BooksOptions());

  const mutation = useMutation({
    ...postApiV1BooksMutation(),
    // TODO: onSuccess: () => queryClient.invalidateQueries({ queryKey: getApiV1BooksQueryKey() })
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
          onClick={() =>
            mutation.mutate({
              body: {
                id: 0,
                title,
                description: "",
                pageCount: 1,
                excerpt: "",
                publishDate: new Date().toISOString(),
              },
            })
          }
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
