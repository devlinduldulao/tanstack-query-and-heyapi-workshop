import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteApiV1BooksByIdMutation,
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
} from "@/api/client/@tanstack/react-query.gen";
import type { Book } from "@/api/client";

export default function Challenge2BugEnd() {
  const queryClient = useQueryClient();
  const queryKey = getApiV1BooksQueryKey();

  const { data: books } = useQuery(getApiV1BooksOptions());

  const remove = useMutation({
    ...deleteApiV1BooksByIdMutation(),
    onMutate: async (vars) => {
      // FIX 1: cancel inflight queries so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Book[]>(queryKey);
      queryClient.setQueryData<Book[]>(queryKey, (old) =>
        old ? old.filter((b) => b.id !== vars.path.id) : old,
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    // FIX 2: invalidate the SAME generated key the read uses
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return (
    <ul className="text-sm space-y-1 max-h-72 overflow-auto">
      {books?.slice(0, 8).map((b) => (
        <li key={b.id} className="flex justify-between border-b py-1">
          <span>{b.title}</span>
          <button
            className="text-xs text-red-500"
            onClick={() => remove.mutate({ path: { id: b.id! } })}
          >
            delete
          </button>
        </li>
      ))}
    </ul>
  );
}
