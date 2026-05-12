# Exercise 2 — Step-by-Step

> Goal: take a starter that has half of a delete-mutation set up and finish it so deleting a book gives clear success/failure feedback **and** refreshes the same generated list that drives the visible UI.

You are editing [`exercise-2.tsx`](../exercise-2.tsx). The reference output is [`solutions/exercise-2-end.tsx`](../solutions/exercise-2-end.tsx).

Compare the two side-by-side and you will see they are already _almost identical_. The point of this exercise is not to write new code — it is to **read** what is there, prove to yourself it is correct, and clean up the `// TODO` markers. This is the realistic code-review skill senior devs use every day.

---

## Mental model first

Three generated helpers do all the heavy lifting:

| Helper                              | What it gives you                                             |
| ----------------------------------- | ------------------------------------------------------------- |
| `getApiV1BooksOptions()`            | The full options object for reading the books list.           |
| `getApiV1BooksQueryKey()`           | The exact same cache key that the read above uses.            |
| `deleteApiV1BooksByIdMutation()`    | A pre-typed mutation options object for `DELETE /books/{id}`. |

The "trick" is that **the read and the post-delete refresh must use the _same_ generated key**. If you typed a manual key like `["books"]`, the delete would succeed on the server but the UI would keep showing the deleted book until the next hard reload.

The work order is:

1. Read the file top-to-bottom and identify each TODO.
2. Confirm the imports already cover what you need.
3. Confirm the `onSuccess` invalidates the right key.
4. Confirm the `onError` shows a toast.
5. Delete the TODO comments.

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

**Why this matters:** the TODO is your acceptance criteria. The word "only" in step 4 is the trap to avoid — do _not_ add `onMutate`, `onSettled`, `setQueryData`, or any optimistic update plumbing. The point of this lab is to prove a clean two-handler flow is enough.

---

## Step 2 — Confirm `useQueryClient()` and `getApiV1BooksQueryKey()` are wired

Look at the top of the component:

```tsx
const queryClient = useQueryClient();
const queryKey = getApiV1BooksQueryKey();
```

**Why both are needed:**

- `queryClient` is the handle to the cache. Without it you cannot call `invalidateQueries`.
- `queryKey` is the address inside the cache. Storing it in a local variable keeps the code DRY in case you later add a second invalidation or a prefetch.

If either line is missing in your edited version, add it now.

---

## Step 3 — Confirm the read query

```tsx
const { data } = useSuspenseQuery(getApiV1BooksOptions());
```

`useSuspenseQuery` (not `useQuery`) is correct because:

- The route uses a Suspense boundary.
- `data` is non-nullable, so `data?.slice(...)` later is just defensive — `data` is already an array.

Nothing to change here.

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

Read it line by line and check each requirement:

1. **`...deleteApiV1BooksByIdMutation()`** — the generated `mutationFn` and types. You did not write a manual `fetch` call. ✅
2. **`onSuccess`** — toast first, then invalidate. The order does not affect correctness, but toasting first means the user sees feedback even if the invalidation is slow. ✅
3. **`void queryClient.invalidateQueries({ queryKey })`** — the `void` operator silences the "floating promise" lint rule because we do not need to await the refetch. Invalidation is fire-and-forget; the components subscribed to that key will re-render when the new data arrives. ✅
4. **`onError`** — shows the server message in a `toast.error`. ✅
5. **No `onMutate`, no `setQueryData`, no rollback.** ✅

If any of those bullets is missing, edit the block to match. If all five are already true, nothing to change.

---

## Step 5 — Confirm the JSX wiring

```tsx
<button onClick={() => deleteBook.mutate({ path: { id: b.id! } })} className="text-xs text-red-500">
  delete
</button>
```

The path argument shape — `{ path: { id: ... } }` — is dictated by the generated `deleteApiV1BooksByIdMutation` type. **Do not** flatten it to `deleteBook.mutate(b.id)` — TypeScript would let you know with a red squiggle, but it is the kind of "fix" a beginner is tempted to make that breaks the contract.

The `b.id!` non-null assertion exists because the generated `Book` type marks `id` as optional. In practice the server always returns one, and we accept that risk inside this small lab.

---

## Step 6 — Remove the `// TODO:` block

Now delete the four-line TODO header. The file should now match `exercise-2-end.tsx` apart from the component name (`Exercise2` vs `Exercise2End`).

---

## Step 7 — Verify in the browser

1. Save the file.
2. Open Exercise 2 in the bootcamp UI.
3. Click "delete" on any book.
4. You should see the success toast _and_ the row disappears from the list.
5. Open DevTools → Network. The sequence must be:
   - `DELETE /api/v1/Books/{id}` (the mutation)
   - `GET /api/v1/Books` (triggered by the invalidation)

If the row does not disappear, your invalidation key does not match the read's key — re-check Step 2.

---

## Code-change cheat sheet

| Where                       | Action                                       | Why                                                       |
| --------------------------- | -------------------------------------------- | --------------------------------------------------------- |
| Top of file                 | Delete the `// TODO:` comment block          | Acceptance criteria are met                               |
| `useQueryClient` + `queryKey` lines | Keep as-is                            | Required for invalidation                                  |
| Mutation `onSuccess`        | Keep `toast.success` + `invalidateQueries`   | Refreshes the same generated list that drives the UI       |
| Mutation `onError`          | Keep `toast.error`                           | Surfaces failures so users do not retry blindly            |
| Anywhere else               | **Do not add** `onMutate`, `setQueryData`, etc. | Rule 4 of the TODO header — keep the flow minimal       |

---

## Why this design is the senior-engineer move

Optimistic updates feel sophisticated, but they double the code path and add an entirely new failure mode (the rollback). The handler-only pattern in this exercise:

- Uses one generated key for read **and** refresh — guaranteed consistency.
- Surfaces every server outcome through the toast.
- Adds zero hand-managed cache state.

If a future requirement actually needs optimistic UX (e.g. drag-to-reorder), you can layer it on top. Until then, this is the right floor.
