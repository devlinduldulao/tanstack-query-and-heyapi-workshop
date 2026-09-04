// TODO: Replace the delete mutation with success/error-only handlers.
// 1. Use useQueryClient() and getApiV1BooksQueryKey().
// 2. In onSuccess, invalidate that generated key and show toast.success(...).
// 3. In onError, show toast.error(...).
// 4. Do not add manual cache writes or extra mutation lifecycle hooks.

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { deleteApiV1BooksByIdMutation, getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";

export default function Exercise6() {
  const { data } = useSuspenseQuery(getApiV1BooksOptions());

  const deleteBook = useMutation({
    ...deleteApiV1BooksByIdMutation(),
  });

  return (
    <ul className="space-y-1 text-sm">
      {data?.slice(0, 5).map((b) => (
        <li key={b.id} className="flex justify-between">
          <span>{b.title}</span>
          <button onClick={() => deleteBook.mutate({ path: { id: b.id! } })} className="text-xs text-red-500">
            delete
          </button>
        </li>
      ))}
    </ul>
  );
}
