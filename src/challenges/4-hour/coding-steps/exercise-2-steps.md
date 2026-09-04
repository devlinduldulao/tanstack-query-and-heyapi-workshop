# Exercise 2 — Step-by-Step

> Goal: finish a delete flow so clicking **delete** shows a success/failure toast **and** refreshes the same generated list that drives the visible UI.

You are editing [`exercise-2.tsx`](../exercise-2.tsx). The reference output is [`solutions/exercise-2-end.tsx`](../solutions/exercise-2-end.tsx).

The starter already lists books and fires the generated delete mutation. It does **not** toast or invalidate. Clicking **delete** should feel unfinished until you add those handlers — then **Show Solution** should match what you wrote.

---

## Mental model first

Three generated helpers do all the heavy lifting:

| Helper                           | What it gives you                                             |
| -------------------------------- | ------------------------------------------------------------- |
| `getApiV1BooksOptions()`         | The full options object for reading the books list.           |
| `getApiV1BooksQueryKey()`        | The exact same cache key that the read above uses.            |
| `deleteApiV1BooksByIdMutation()` | A pre-typed mutation options object for `DELETE /books/{id}`. |

The "trick" is that **the read and the post-delete refresh must use the _same_ generated key**. If you typed a manual key like `["books"]`, the delete would succeed on the server but the UI would keep showing the deleted book until the next hard reload.

> `fakerestapi` is a read-only mock: `DELETE` returns 200 but the next `GET` still includes the book. Judge this lab by the **toast** and the **Network tab** (DELETE, then GET on the generated list), not by whether the row vanishes forever.

---

## Step 1 — Read the TODO header

Open [`exercise-2.tsx`](../exercise-2.tsx). At the top you will see:

```tsx
// TODO: Replace the delete mutation with success/error-only handlers.
// 1. Use useQueryClient() and getApiV1BooksQueryKey().
// 2. In onSuccess, invalidate that generated key and show toast.success(...).
// 3. In onError, show toast.error(...).
// 4. Do not add manual cache writes or extra mutation lifecycle hooks.
```

The word "only" in step 4 is the trap — do **not** add `onMutate`, `onSettled`, `setQueryData`, or any optimistic update plumbing.

---

## Step 2 — Add `useQueryClient()` and `getApiV1BooksQueryKey()`

Add the missing imports and wire them at the top of the component:

```tsx
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteApiV1BooksByIdMutation,
  getApiV1BooksOptions,
  getApiV1BooksQueryKey,
} from "@/api/client/@tanstack/react-query.gen";

export default function Exercise2() {
  const queryClient = useQueryClient();
  const queryKey = getApiV1BooksQueryKey();
  const { data } = useSuspenseQuery(getApiV1BooksOptions());
```

- `queryClient` is the handle to the cache. Without it you cannot call `invalidateQueries`.
- `queryKey` is the address inside the cache. Storing it in a local variable keeps the read and the refresh on the same identity.

---

## Step 3 — Add success and error handlers

The starter mutation is:

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

Check each requirement:

1. **`...deleteApiV1BooksByIdMutation()`** — generated `mutationFn` and types. No manual `fetch`.
2. **`onSuccess`** — toast, then invalidate the generated list key.
3. **`void queryClient.invalidateQueries({ queryKey })`** — fire-and-forget refetch; `void` silences the floating-promise lint.
4. **`onError`** — surfaces the server message.
5. **No `onMutate`, no `setQueryData`, no rollback.**

---

## Step 4 — Leave the JSX alone

```tsx
<button onClick={() => deleteBook.mutate({ path: { id: b.id! } })} className="text-xs text-red-500">
  delete
</button>
```

The path argument shape — `{ path: { id: ... } }` — is dictated by the generated mutation type. **Do not** flatten it to `deleteBook.mutate(b.id)`.

---

## Step 5 — Delete the `// TODO:` block

The file should now match `exercise-2-end.tsx` apart from the component name (`Exercise2` vs `Exercise2End`).

---

## Step 6 — Verify in the browser

1. Save the file.
2. Open Exercise 2 in the bootcamp UI.
3. Click **delete** on any book.
4. You should see the success toast. **Show Solution** should behave the same way.
5. Open DevTools → Network. The sequence must be:
   - `DELETE /api/v1/Books/{id}` (the mutation)
   - `GET /api/v1/Books` (triggered by the invalidation)

If the toast is missing, the handlers are not wired. If the GET never fires, the invalidation key does not match the read.

---

## Code-change cheat sheet

| Where                         | Action                                     | Why                                                  |
| ----------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| Imports                       | Add `useQueryClient`, `toast`, query key   | Required for invalidation and feedback               |
| `useQueryClient` + `queryKey` | Add                                        | Same generated identity for read and refresh         |
| Mutation `onSuccess`          | `toast.success` + `invalidateQueries`      | Refreshes the same generated list that drives the UI |
| Mutation `onError`            | `toast.error`                              | Surfaces failures so users do not retry blindly      |
| Anywhere else                 | **Do not add** `onMutate` / `setQueryData` | Rule 4 of the TODO header                            |

---

## Why this design is the senior-engineer move

Optimistic updates feel sophisticated, but they double the code path and add an entirely new failure mode (the rollback). The handler-only pattern in this exercise:

- Uses one generated key for read **and** refresh — guaranteed consistency.
- Surfaces every server outcome through the toast.
- Adds zero hand-managed cache state.
