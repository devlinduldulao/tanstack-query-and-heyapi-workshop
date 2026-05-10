// Bug Challenge — find & fix the two bugs.
// Symptoms:
//  1. Deleted book reappears after ~1s.
//  2. Rapid clicks delete the wrong rows.
//
// Hint: keep the generated books key in one place.
// Hint: onMutate is missing critical steps.

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  deleteApiV1BooksByIdMutation,
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
} from "@/api/client/@tanstack/react-query.gen";
import type { Book } from "@/api/client";

export default function Challenge2Bug() {
  const queryClient = useQueryClient();
  const queryKey = getApiV1BooksQueryKey();

  const { data: books } = useSuspenseQuery(getApiV1BooksOptions());

  const remove = useMutation({
    ...deleteApiV1BooksByIdMutation(),
    onMutate: (vars) => {
      // BUG 1: no cancelQueries; no snapshot
      const previous = queryClient.getQueryData<Book[]>(queryKey);
      queryClient.setQueryData<Book[]>(queryKey, (old) => (old ? old.filter((b) => b.id !== vars.path.id) : old));
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <ul className="max-h-72 space-y-1 overflow-auto text-sm">
      {books?.slice(0, 8).map((b) => (
        <li key={b.id} className="flex justify-between border-b py-1">
          <span>{b.title}</span>
          <button className="text-xs text-red-500" onClick={() => remove.mutate({ path: { id: b.id! } })}>
            delete
          </button>
        </li>
      ))}
    </ul>
  );
}
