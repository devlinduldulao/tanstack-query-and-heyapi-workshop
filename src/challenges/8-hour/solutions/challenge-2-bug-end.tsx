import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteApiV1BooksByIdMutation,
  getApiV1AuthorsOptions,
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
} from "@/api/client/@tanstack/react-query.gen";

export default function Challenge2BugEnd() {
  const queryClient = useQueryClient();
  const queryKey = getApiV1BooksQueryKey();

  const { data: books } = useSuspenseQuery(getApiV1BooksOptions());
  const { data: authors, isFetching: authorsFetching } = useSuspenseQuery(getApiV1AuthorsOptions());

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
    <div className="grid gap-4 text-sm md:grid-cols-2">
      <section>
        <h3 className="mb-2 font-semibold">Books</h3>
        <ul className="max-h-72 space-y-1 overflow-auto">
          {books?.slice(0, 8).map((b) => (
            <li key={b.id} className="flex justify-between border-b py-1">
              <span>{b.title}</span>
              <button className="text-xs text-red-500" onClick={() => remove.mutate({ path: { id: b.id! } })}>
                delete
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="mb-2 flex items-center gap-2 font-semibold">
          Authors
          {authorsFetching && <span className="text-muted-foreground text-xs font-normal">Refreshing...</span>}
        </h3>
        <ul className="max-h-72 space-y-1 overflow-auto">
          {authors?.slice(0, 6).map((author) => (
            <li key={author.id} className="border-b py-1">
              {author.firstName} {author.lastName}
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground mt-2 text-xs">This query should not move when a book is deleted.</p>
      </section>
    </div>
  );
}
