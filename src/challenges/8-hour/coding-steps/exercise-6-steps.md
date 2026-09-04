# Exercise 6 — Step-by-Step

> Goal: finish a delete flow so clicking **delete** shows a success/failure toast **and** refreshes the same generated list that drives the visible UI.

You are editing [`exercise-6.tsx`](../exercise-6.tsx). The reference output is [`solutions/exercise-6-end.tsx`](../solutions/exercise-6-end.tsx).

The starter already lists books and fires the generated delete mutation. It does **not** toast or invalidate. Clicking **delete** should feel unfinished until you add those handlers — then **Show Solution** should match what you wrote.

---

## Mental model first

Three generated helpers do all the heavy lifting:

| Helper                           | What it gives you                                             |
| -------------------------------- | ------------------------------------------------------------- |
| `getApiV1BooksOptions()`         | The full options object for reading the books list.           |
| `getApiV1BooksQueryKey()`        | The exact same cache key that the read above uses.            |
| `deleteApiV1BooksByIdMutation()` | A pre-typed mutation options object for `DELETE /books/{id}`. |

The rule: **the read and the post-delete refresh must use the _same_ generated key**. If you typed `["books"]` for one and `getApiV1BooksQueryKey()` for the other, the delete would succeed but the UI would keep showing the deleted book until a hard reload.

> `fakerestapi` is a read-only mock: `DELETE` returns 200 but the next `GET` still includes the book. Judge this lab by the **toast** and the **Network tab** (DELETE, then GET on the generated list), not by whether the row vanishes forever.

---

## Step 1 — Read the TODO header

```tsx
// TODO: Replace the delete mutation with success/error-only handlers.
// 1. Use useQueryClient() and getApiV1BooksQueryKey().
// 2. In onSuccess, invalidate that generated key and show toast.success(...).
// 3. In onError, show toast.error(...).
// 4. Do not add manual cache writes or extra mutation lifecycle hooks.
```

Do **not** add `onMutate`, `onSettled`, `setQueryData`, or optimistic update plumbing.

---

## Step 2 — Add `useQueryClient()` and `getApiV1BooksQueryKey()`

```tsx
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteApiV1BooksByIdMutation,
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
} from "@/api/client/@tanstack/react-query.gen";

export default function Exercise6() {
  const queryClient = useQueryClient();
  const queryKey = getApiV1BooksQueryKey();
  const { data } = useSuspenseQuery(getApiV1BooksOptions());
```

---

## Step 3 — Add success and error handlers

The starter mutation is empty of handlers:

```tsx
const deleteBook = useMutation({
  ...deleteApiV1BooksByIdMutation(),
});
```

Replace it with:

```tsx
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
```

---

## Step 4 — Leave the JSX alone

```tsx
<button onClick={() => deleteBook.mutate({ path: { id: b.id! } })} className="text-xs text-red-500">
  delete
</button>
```

Always `{ path: { id } }`. Do not flatten to `deleteBook.mutate(b.id)`.

---

## Step 5 — Delete the `// TODO:` header

The file should now match `exercise-6-end.tsx` apart from the component name.

---

## Step 6 — Verify in the browser

1. Save.
2. Open Exercise 6.
3. Click **delete**. You should see the success toast. **Show Solution** should behave the same way.
4. DevTools → Network: `DELETE /api/v1/Books/{id}` then `GET /api/v1/Books`.

---

## Code-change cheat sheet

| Where                | Action                                | Why                                     |
| -------------------- | ------------------------------------- | --------------------------------------- |
| Imports              | Add query client, toast, generated key | Required for refresh + feedback        |
| Mutation `onSuccess` | Toast + `invalidateQueries`           | Same generated list identity            |
| Mutation `onError`   | `toast.error`                         | Visible failure                         |
| Anywhere else        | Do not add `onMutate` / `setQueryData` | Keep the flow to success/error only    |
