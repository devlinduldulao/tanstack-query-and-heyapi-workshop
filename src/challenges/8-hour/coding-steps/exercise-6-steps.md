# Exercise 6 — Step-by-Step

> Goal: take a starter that has a delete-mutation set up and finish it so deleting a book gives clear success/failure feedback **and** refreshes the same generated list that drives the visible UI.

You are editing [`exercise-6.tsx`](../exercise-6.tsx). Reference: [`solutions/exercise-6-end.tsx`](../solutions/exercise-6-end.tsx).

The starter and the solution are nearly identical. The point of this exercise is to **read** what is there, prove to yourself it is correct, and remove the TODO markers. This is the realistic code-review skill senior devs use every day.

---

## Mental model first

Three generated helpers do all the heavy lifting:

| Helper                              | What it gives you                                             |
| ----------------------------------- | ------------------------------------------------------------- |
| `getApiV1BooksOptions()`            | The full options object for reading the books list.           |
| `getApiV1BooksQueryKey()`           | The exact same cache key that the read above uses.            |
| `deleteApiV1BooksByIdMutation()`    | A pre-typed mutation options object for `DELETE /books/{id}`. |

The rule: **the read and the post-delete refresh must use the _same_ generated key**. If you typed `["books"]` for one and `getApiV1BooksQueryKey()` for the other, the delete would succeed but the UI would keep showing the deleted book until a hard reload.

Work order:

1. Read the file top-to-bottom and identify each TODO.
2. Confirm `useQueryClient()` and `getApiV1BooksQueryKey()` are wired.
3. Confirm `onSuccess` invalidates the right key.
4. Confirm `onError` shows a toast.
5. Delete the TODO header.

---

## Step 1 — Read the TODO header

```tsx
// TODO: Replace the delete mutation with success/error-only handlers.
// 1. Use useQueryClient() and getApiV1BooksQueryKey().
// 2. In onSuccess, invalidate that generated key and show toast.success(...).
// 3. In onError, show toast.error(...).
// 4. Do not add manual cache writes or extra mutation lifecycle hooks.
```

**Why the word "only" in step 4 matters:** do not add `onMutate`, `onSettled`, `setQueryData`, or any optimistic update plumbing. The lesson is that a clean two-handler flow is enough.

---

## Step 2 — Confirm `useQueryClient()` and `getApiV1BooksQueryKey()`

```tsx
const queryClient = useQueryClient();
const queryKey = getApiV1BooksQueryKey();
```

- `queryClient` is the handle to the cache. Without it you cannot call `invalidateQueries`.
- `queryKey` is the cache address. Storing it in a local variable keeps the code DRY in case you later add a second invalidation.

If either line is missing, add it.

---

## Step 3 — Confirm the read query

```tsx
const { data } = useSuspenseQuery(getApiV1BooksOptions());
```

`useSuspenseQuery` (not `useQuery`) is correct because the route uses a Suspense boundary, and `data` is non-nullable. Nothing to change.

---

## Step 4 — Confirm the mutation block

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

Read each line and check the requirement:

1. **`...deleteApiV1BooksByIdMutation()`** — the generated `mutationFn` and types. No manual `fetch` here. ✅
2. **`onSuccess`** — toast first, then invalidate. The order does not affect correctness; toasting first means the user sees feedback even if the invalidation is slow. ✅
3. **`void queryClient.invalidateQueries({ queryKey })`** — the `void` operator silences the floating-promise lint rule. Invalidation is fire-and-forget. ✅
4. **`onError`** — shows the server's error message. ✅
5. **No `onMutate`, no `setQueryData`, no rollback.** ✅

All five satisfied. Nothing to change.

---

## Step 5 — Confirm the JSX wiring

```tsx
<button onClick={() => deleteBook.mutate({ path: { id: b.id! } })} className="text-xs text-red-500">
  delete
</button>
```

The path arg shape `{ path: { id: ... } }` is dictated by the generated mutation type. **Do not** flatten it to `deleteBook.mutate(b.id)`.

The `b.id!` non-null assertion exists because `Book.id` is optional in the generated type. In practice the server always returns an id, and we accept that risk in this small lab.

---

## Step 6 — Remove the `// TODO:` header

Delete the five-line block. The file should now match `exercise-6-end.tsx` apart from the component name (`Exercise6` vs `Exercise6End`).

---

## Step 7 — Verify in the browser

1. Save.
2. Open Exercise 6.
3. Click "delete" on any book.
4. Success toast appears _and_ the row disappears.
5. DevTools → Network sequence:
   - `DELETE /api/v1/Books/{id}` (the mutation)
   - `GET /api/v1/Books` (triggered by the invalidation)

If the row stays after delete, your invalidation key does not match the read key — re-check Step 2.

---

## Code-change cheat sheet

| Where                              | Action                                       |
| ---------------------------------- | -------------------------------------------- |
| Top of file                        | Delete the `// TODO:` header                  |
| `useQueryClient` + `queryKey` lines | Keep as-is                                   |
| Mutation `onSuccess`               | Keep `toast.success` + `invalidateQueries`   |
| Mutation `onError`                 | Keep `toast.error`                           |
| Anywhere else                      | **Do not add** `onMutate`, `setQueryData`, etc. |

---

## Why this is the senior-engineer move

Optimistic updates feel sophisticated, but they double the code path and add a new failure mode (the rollback). The handler-only pattern:

- Uses one generated key for read **and** refresh — guaranteed consistency.
- Surfaces every server outcome through the toast.
- Adds zero hand-managed cache state.

When a future requirement actually needs optimistic UX (e.g. drag-to-reorder), you can layer it on top. Until then, this is the right floor.
