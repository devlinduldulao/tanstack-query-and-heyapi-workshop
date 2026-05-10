import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteApiV1BooksByIdMutation,
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
} from "@/api/client/@tanstack/react-query.gen";

export default function Exercise2End() {
  const queryClient = useQueryClient();
  const queryKey = getApiV1BooksQueryKey();

  const { data } = useSuspenseQuery(getApiV1BooksOptions());

  const deleteBook = useMutation({
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
