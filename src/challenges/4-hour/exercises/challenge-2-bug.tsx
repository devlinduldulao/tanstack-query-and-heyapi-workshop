// Bug Challenge — find & fix the two bugs.
// Symptoms:
//  1. Success toast fires, but the row vanishes and never comes back from the real list cache.
//  2. Rapid clicks delete the wrong rows.
//
// Hint: keep the generated books key in one place.
// Hint: use success and error handlers only.

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteApiV1BooksByIdMutation,
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
} from "@/api/client/@tanstack/react-query.gen";
import type { Book } from "@/api/client";

export default function Challenge2Bug() {
  const queryClient = useQueryClient();
  const generatedKey = getApiV1BooksQueryKey();
  // BUG: this hand-written key is not the identity getApiV1BooksOptions() reads from.
  const queryKey = ["books"];

  const { data: books } = useSuspenseQuery(getApiV1BooksOptions());

  const remove = useMutation({
    ...deleteApiV1BooksByIdMutation(),
    onMutate: async ({ path }) => {
      await queryClient.cancelQueries({ queryKey: generatedKey });
      const previous = queryClient.getQueryData<Book[]>(generatedKey);
      queryClient.setQueryData<Book[]>(generatedKey, (current) => current?.filter((book) => book.id !== path.id));
      return { previous };
    },
    onSuccess: () => {
      toast.success("Book deleted");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(generatedKey, context.previous);
      }
    },
  });

  return (
    <ul className="max-h-72 space-y-1 overflow-auto text-sm">
      {books?.slice(0, 8).map((b, index) => (
        <li key={index} className="flex justify-between border-b py-1">
          <span>{b.title}</span>
          <button className="text-xs text-red-500" onClick={() => remove.mutate({ path: { id: b.id! } })}>
            delete
          </button>
        </li>
      ))}
    </ul>
  );
}
