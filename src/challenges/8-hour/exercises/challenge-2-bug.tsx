// Bug Challenge — find & fix the cache races.
// Symptoms:
//  1. Success toast fires, but the deleted book vanishes and never refetches from the books list cache.
//  2. The unrelated authors query refreshes on every book delete (over-broad / wrong identity).
//  3. Rapid clicks delete the wrong rows.
//
// Hint: cancel and invalidate the generated BOOKS list key, not authors.
// Hint: use success and error handlers only.

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteApiV1BooksByIdMutation,
  getApiV1AuthorsOptions,
  getApiV1AuthorsQueryKey,
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
} from "@/api/client/@tanstack/react-query.gen";
import type { Book } from "@/api/client";

export default function Challenge2Bug() {
  const queryClient = useQueryClient();
  const booksKey = getApiV1BooksQueryKey();
  const authorsKey = getApiV1AuthorsQueryKey();

  const { data: books } = useSuspenseQuery(getApiV1BooksOptions());
  const { data: authors, isFetching: authorsFetching } = useSuspenseQuery(getApiV1AuthorsOptions());

  const remove = useMutation({
    ...deleteApiV1BooksByIdMutation(),
    onMutate: async ({ path }) => {
      // BUG: cancels authors instead of the in-flight books list read.
      await queryClient.cancelQueries({ queryKey: authorsKey });
      const previous = queryClient.getQueryData<Book[]>(booksKey);
      queryClient.setQueryData<Book[]>(booksKey, (current) => current?.filter((book) => book.id !== path.id));
      return { previous };
    },
    onSuccess: () => {
      toast.success("Book deleted");
      // BUG: over-broad / wrong identity — refreshes authors, not the generated books list.
      void queryClient.invalidateQueries({ queryKey: authorsKey });
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(booksKey, context.previous);
      }
    },
  });

  return (
    <div className="grid gap-4 text-sm md:grid-cols-2">
      <section>
        <h3 className="mb-2 font-semibold">Books</h3>
        <ul className="max-h-72 space-y-1 overflow-auto">
          {books?.slice(0, 8).map((b, index) => (
            <li key={index} className="flex justify-between border-b py-1">
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
