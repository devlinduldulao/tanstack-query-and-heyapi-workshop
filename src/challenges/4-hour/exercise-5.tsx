// TODO:
// 1. Extend zBook with UI-level constraints.
// 2. Validate the form payload before mutation.mutate.
// 3. Keep validation errors separate from network errors.
// 4. Invalidate getApiV1BooksQueryKey() after a successful generated mutation.

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getApiV1BooksQueryKey, postApiV1BooksMutation } from "@/api/client/@tanstack/react-query.gen";
import { zBook } from "@/api/client/zod.gen";

const createBookSchema = zBook.extend({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  pageCount: z.coerce.number().int().positive("Page count must be positive"),
});

export default function Exercise5() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [pageCount, setPageCount] = useState("120");
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useMutation({
    ...postApiV1BooksMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getApiV1BooksQueryKey() });
    },
  });

  return (
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

        // TODO: call mutation.mutate({ body: parsed.data }) and clear the form on success.
      }}
      className="max-w-sm space-y-3 text-sm"
    >
      <input
        className="w-full rounded border px-2 py-1"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full rounded border px-2 py-1"
        placeholder="Page count"
        value={pageCount}
        onChange={(e) => setPageCount(e.target.value)}
      />
      {validationError && <p className="text-xs text-red-500">{validationError}</p>}
      {mutation.isError && <p className="text-xs text-red-500">{mutation.error.message}</p>}
      <button type="submit" disabled={mutation.isPending} className="rounded border px-3 py-1 disabled:opacity-50">
        {mutation.isPending ? "Saving…" : "Add book with generated mutation"}
      </button>
    </form>
  );
}
