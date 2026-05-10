// TODO: Implement an optimistic delete using onMutate / onError / onSettled
// 1. cancelQueries(getApiV1BooksQueryKey())
// 2. snapshot previous = getQueryData(getApiV1BooksQueryKey())
// 3. setQueryData(getApiV1BooksQueryKey(), (old) => old.filter(b => b.id !== id))
// 4. return { previous } as context
// 5. onError -> setQueryData(["books-6"], context.previous)
// 6. onSettled -> invalidateQueries(getApiV1BooksQueryKey())

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { deleteApiV1BooksByIdMutation, getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";

export default function Exercise2() {
  const { data } = useSuspenseQuery(getApiV1BooksOptions());

  const deleteBook = useMutation({
    ...deleteApiV1BooksByIdMutation(),
    // TODO: onMutate, onError, onSettled
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
