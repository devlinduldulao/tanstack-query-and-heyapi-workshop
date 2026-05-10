import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteApiV1BooksByIdMutation,
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
} from "@/api/client/@tanstack/react-query.gen";

export default function Challenge2BugEnd() {
  const queryClient = useQueryClient();
  const queryKey = getApiV1BooksQueryKey();

  const { data: books } = useSuspenseQuery(getApiV1BooksOptions());

  const remove = useMutation({
    ...deleteApiV1BooksByIdMutation(),
    onSuccess: () => {
      toast.success("Book deleted");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`);
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
