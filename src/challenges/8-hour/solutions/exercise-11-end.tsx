import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
  postApiV1BooksMutation,
} from "@/api/client/@tanstack/react-query.gen";
import { zBook } from "@/api/client/zod.gen";

const createBookSchema = zBook.extend({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  pageCount: z.coerce.number().int().positive("Page count must be positive"),
});

export default function Exercise11End() {
  const [title, setTitle] = useState("");
  const [pageCount, setPageCount] = useState("120");
  const [validationError, setValidationError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: books } = useSuspenseQuery(getApiV1BooksOptions());

  const mutation = useMutation({
    ...postApiV1BooksMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getApiV1BooksQueryKey() });
    },
  });

  return (
    <div className="max-w-sm space-y-3 text-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setValidationError(null);

          const parsed = createBookSchema.safeParse({
            id: 0,
            title,
            description: "Created from the workshop",
            pageCount,
            excerpt: "Generated mutation + generated Zod schema",
            publishDate: new Date().toISOString(),
          });

          if (!parsed.success) {
            setValidationError(parsed.error.issues.map((issue) => issue.message).join(", "));
            return;
          }

          mutation.mutate({
            body: parsed.data,
          });
          setTitle("");
          setPageCount("120");
        }}
        className="grid gap-2 sm:grid-cols-[1fr_100px_auto]"
      >
        <input
          className="flex-1 rounded border px-2 py-1"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="rounded border px-2 py-1"
          placeholder="Pages"
          value={pageCount}
          onChange={(e) => setPageCount(e.target.value)}
        />
        <button type="submit" disabled={mutation.isPending} className="rounded border px-3 py-1 disabled:opacity-50">
          {mutation.isPending ? "…" : "Add"}
        </button>
      </form>
      {validationError && <p className="text-xs text-red-500">{validationError}</p>}
      {mutation.isError && <p className="text-xs text-red-500">{mutation.error.message}</p>}
      <ul className="space-y-1">
        {books?.slice(0, 5).map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}
