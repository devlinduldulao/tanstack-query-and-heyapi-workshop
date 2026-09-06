# Challenge 2: Cache Race Bug — Step-by-Step

> Goal: this is the **full** 8-hour debugging exercise. The 4-hour track only has a mismatched books-list key. Here the starter also cancels/invalidates **authors** and writes the books cache by hand.

You are reviewing [`challenge-2-bug.tsx`](../challenge-2-bug.tsx). The reference output is [`solutions/challenge-2-bug-end.tsx`](../solutions/challenge-2-bug-end.tsx).

---

## Mental model

Three bugs share one root cause: the delete mutation is not talking to the same generated identity that the books list reads.

1. **Wrong invalidation target** — `getApiV1AuthorsQueryKey()` instead of `getApiV1BooksQueryKey()`.
2. **Missing cancellation on the list** — `cancelQueries` runs against authors, so an in-flight books GET can still land.
3. **Manual cache write** — `setQueryData` makes the books row vanish without ever refetching the generated list.
4. **Index keys** — `key={index}` races when the list shifts.

**The fix:** one generated books key, used by the read, the cancel (if you keep one), and the invalidation. No `onMutate`. Authors stay out of the delete path.

---

## Step 1 — Reproduce the starter

Open the 8-hour challenge (not Show Solution) and click **delete** on a book:

1. The book row vanishes immediately (`setQueryData` on the books list).
2. A success toast fires.
3. The **Authors** heading shows **Refreshing...** — over-broad / wrong identity.
4. The book row **stays gone**. Authors were invalidated; the generated books list was not.
5. Rows use `key={index}`, so rapid clicks can hit the wrong React row.

**Show Solution** must look different: the book row stays, authors do **not** flash, and Network shows `DELETE /books/{id}` then `GET /books` — not a fresh `GET /authors`.

> `fakerestapi` is a read-only mock. The fixed books list still shows the book after refetch. That is the cache telling the truth. The starter's vanished row is a local lie.

---

## Step 2 — Point at the exact bugs

```tsx
const booksKey = getApiV1BooksQueryKey();
const authorsKey = getApiV1AuthorsQueryKey();

onMutate: async ({ path }) => {
  await queryClient.cancelQueries({ queryKey: authorsKey }); // wrong query
  queryClient.setQueryData(booksKey, (current) => current?.filter(...));
},
onSuccess: () => {
  void queryClient.invalidateQueries({ queryKey: authorsKey }); // wrong identity
},
```

And `key={index}` on the books list.

---

## Step 3 — Apply the fix

```tsx
const queryClient = useQueryClient();
const queryKey = getApiV1BooksQueryKey();

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
```

```tsx
{books?.slice(0, 8).map((b) => (
  <li key={b.id} className="flex justify-between border-b py-1">
```

Keep the authors panel as a canary — it still reads `getApiV1AuthorsOptions()`, but the delete mutation must not touch `authorsKey`.

Delete `onMutate`, `setQueryData`, and every authors key in the mutation.

---

## Step 4 — Verify

1. Starter: delete a book → row gone, authors **Refreshing...**
2. Show Solution: delete a book → toast, row stays, authors do not refresh.
3. Network on the solution: one `DELETE /api/v1/Books/{id}`, one `GET /api/v1/Books`, **no** authors GET.

---

## Code-change cheat sheet

| Bug pattern                                      | Fix                                    |
| ------------------------------------------------ | -------------------------------------- |
| Invalidate / cancel `getApiV1AuthorsQueryKey()`  | Use `getApiV1BooksQueryKey()` only     |
| `onMutate` / `setQueryData` / rollback           | Remove. Success + error handlers only  |
| Missing `toast.error`                            | Add it on `onError`                    |
| `key={index}`                                    | `key={b.id}`                           |

---

## Common mistakes

- **Inventing a query key as a literal string.** Always use the generated `xxxQueryKey()`.
- **Cancelling the wrong query.** Cancellation is only useful on the read that is about to be overwritten.
- **`invalidateQueries()` with no key.** That is the over-broad version of this same bug.
- **Mixing `onMutate` with `onSuccess` invalidation.** Pick one strategy per mutation.
