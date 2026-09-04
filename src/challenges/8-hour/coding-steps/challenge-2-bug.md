# Challenge 2: Cache Race Bug — Step-by-Step

> Goal: this is a **debugging** exercise. The starter delete flow looks busy — optimistic writes, extra lifecycle hooks, two different cache keys. Your job is to reproduce the symptoms, name the bugs, and simplify the mutation down to generated success/error handlers.

You are reviewing [`challenge-2-bug.tsx`](../challenge-2-bug.tsx). The reference output is [`solutions/challenge-2-bug-end.tsx`](../solutions/challenge-2-bug-end.tsx).

---

## Mental model: why this bug exists in real codebases

The reported symptoms are:

1. Deleted books reappear after about a second.
2. Rapid clicks delete the wrong rows.

In a TanStack Query + Hey API codebase, both symptoms share one root cause: the read and the invalidation are not addressing the _same_ cache entry. There are three ways this happens in practice:

1. The read uses a generated key, but the invalidation uses a hand-written string array (`["books"]`).
2. The read uses `getApiV1BooksOptions()` (which produces a parameterized key), but the invalidation uses `getApiV1BooksQueryKey({ otherParams })` with different args.
3. The mutation uses optimistic updates with `setQueryData` against a snapshot, then `onSettled` invalidates — the optimistic write wins for a moment, then the real cache flips back.

**The fix is the same in all three cases:** one generated key, used by the read _and_ the invalidation, with no manual cache writes between them.

---

## Step 1 — Reproduce the starter

Open the challenge (not Show Solution) and click **delete**:

1. The row vanishes immediately (optimistic `setQueryData` on the generated list).
2. A success toast fires.
3. About a second later the row **comes back** (`onSettled` invalidates the generated key; the mock API never persisted the delete).
4. The list uses `key={index}`, so when rows shift, rapid clicks can hit the wrong React row.

That vanish-then-reappear is the bug, not the mock API by itself. **Show Solution** should not vanish-then-restore: it only toasts and invalidates the generated key.

> `fakerestapi.vercel.app` is a **read-only mock**. Even the fixed code will still show the book after the refetch. Judge the fix by: one generated key, no `setQueryData`, a failure toast, and `key={b.id}` — not by a row that stays gone forever.

---

## Step 2 — Point at the exact bugs

```tsx
const generatedKey = getApiV1BooksQueryKey();
const queryKey = ["books"]; // wrong identity

onMutate: async ({ path }) => {
  queryClient.setQueryData(generatedKey, (current) => current?.filter(...));
},
onSuccess: () => {
  void queryClient.invalidateQueries({ queryKey }); // refreshes the wrong cache entry
},
onError: (_error, _variables, context) => {
  // rollback instead of a failure toast
},
onSettled: () => {
  void queryClient.invalidateQueries({ queryKey: generatedKey });
},
```

And in the list:

```tsx
{books?.slice(0, 8).map((b, index) => (
  <li key={index}>
```

**Ask yourself out loud:**

1. Does the read share its key with the invalidation target? — No. Read uses `getApiV1BooksOptions()`; success invalidates `["books"]`.
2. Are there manual cache writes? — Yes. `onMutate` / `setQueryData` / rollback.
3. Is error feedback a toast? — No. Failures silently roll back.
4. Are list keys stable book ids? — No. Index keys race when the list shifts.

---

## Step 3 — Apply the fix

Replace the mutation with success/error-only handlers on the generated key, and key the rows by `b.id`:

```tsx
const queryClient = useQueryClient();
const queryKey = getApiV1BooksQueryKey();
const { data: books } = useSuspenseQuery(getApiV1BooksOptions());

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

Delete `onMutate`, `onSettled`, `setQueryData`, and the hand-written `["books"]` key.

The file should now match `challenge-2-bug-end.tsx` apart from the component name.

---

## Step 4 — Verify

1. Toggle **Show Solution** and click delete. Toast fires. No vanish-then-reappear flicker.
2. Network: one `DELETE /api/v1/Books/{id}`, then one `GET /api/v1/Books` on the generated list key.
3. Rapid-click three rows. Three DELETEs go out with three distinct ids.

---

## Code-change cheat sheet

| Bug pattern                            | Fix                                    |
| -------------------------------------- | -------------------------------------- |
| Hand-written `["books"]` invalidation  | Replace with `getApiV1BooksQueryKey()` |
| `onMutate` / `setQueryData` / rollback | Remove. Success + error handlers only  |
| Missing `toast.error`                  | Add it on `onError`                    |
| `key={index}`                          | `key={b.id}`                           |

---

## Common mistakes (when this kind of bug is real)

- **Inventing a query key as a literal string.** Always use the generated `xxxQueryKey()`.
- **Mixing `onMutate` (optimistic write) with `onSuccess` (invalidate).** Pick one strategy per mutation.
- **Invalidating with `refetchType: "none"`.** Looks like a refresh, isn't.
- **Refreshing a different screen's key.** If the delete is on `Books`, do not refresh `Authors`.
