import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  deleteApiV1BooksByIdMutation,
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
} from "@/api/client/@tanstack/react-query.gen";
import type { Book } from "@/api/client";

export default function Exercise2End() {
  const queryClient = useQueryClient();
  const queryKey = getApiV1BooksQueryKey();

  const { data } = useSuspenseQuery(getApiV1BooksOptions());

  const deleteBook = useMutation({
    ...deleteApiV1BooksByIdMutation(),
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Book[]>(queryKey);
      queryClient.setQueryData<Book[]>(queryKey, (old) => (old ? old.filter((b) => b.id !== vars.path.id) : old));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
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
