# Challenge 2: Cache Race Bug — Step-by-Step

> Goal: this is a **debugging** exercise. You are given a delete flow that looks correct on first glance. Your job is to confirm it really is correct, prove the bug is in the **read identity**, and write down the senior-engineer checklist that prevents this class of bug.

You are reviewing [`challenge-2-bug.tsx`](../challenge-2-bug.tsx). The reference output is [`solutions/challenge-2-bug-end.tsx`](../solutions/challenge-2-bug-end.tsx).

---

## Mental model: why this bug exists in real codebases

The reported symptoms are:

1. Deleted books reappear.
2. Rapid clicks delete the wrong rows.

In a TanStack Query + Hey API codebase, **both symptoms have a single root cause**: the read and the invalidation are not addressing the _same_ cache entry. There are three ways this happens in practice:

1. The read uses a generated key, but the invalidation uses a hand-written string array (`["books"]`).
2. The read uses `getApiV1BooksOptions()` (which produces a parameterized key), but the invalidation uses `getApiV1BooksQueryKey({ otherParams })` with different args.
3. The mutation uses optimistic updates with `setQueryData` against a stale snapshot, then `onSuccess` invalidates a different key — the optimistic write wins for 1 second, then the real cache flips back to the old data.

**The fix is the same in all three cases:** one generated key, used by the read _and_ the invalidation, with no manual cache writes between them.

---

## Step 1 — Read the file end to end without making assumptions

Open [`challenge-2-bug.tsx`](../challenge-2-bug.tsx). Read it top to bottom. Resist the urge to start fixing — first you need to be able to point to the exact line that would fail if the bug were present.

Note these key lines:

```tsx
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

**Ask yourself out loud:**

1. Does the read in `useSuspenseQuery` share its key with `queryKey`? — Yes, because `getApiV1BooksOptions()` internally calls `getApiV1BooksQueryKey()` with the same args (none).
2. Is the invalidation pointing at the same `queryKey`? — Yes.
3. Are there any manual cache writes (`setQueryData`, `onMutate` with rollbacks)? — No.
4. Are there extra mutation lifecycle hooks? — No.

**Conclusion:** this file as-given is _already_ correct. The "bug" you are debugging is **the absence of bugs** — a deliberate setup that looks suspicious because of the symptoms reported, but actually meets every requirement.

If your eye lands on `b.id!` as suspicious, that's a `Book.id` being optional in the generated type. It is _not_ the cache bug — it would cause a different symptom (a `TypeError` when id is missing).

---

## Step 2 — Compare against the solution

Open [`solutions/challenge-2-bug-end.tsx`](../solutions/challenge-2-bug-end.tsx) side by side with the starter.

They are **identical** except for the component name (`Challenge2Bug` vs `Challenge2BugEnd`).

This is intentional. The challenge is to recognize that **the symptoms in the bug report can be wrong** — sometimes the reporter is looking at the wrong build, a stale cache, or a previous version of the file. A senior engineer always verifies the symptom with their own eyes before changing code.

---

## Step 3 — Reproduce (or fail to reproduce) the symptoms

Run the bootcamp app and open the challenge:

1. Click delete on a book → does the row disappear and stay gone? It should.
2. Rapid-click delete on three different rows → do all three disappear correctly? They should.
3. DevTools → Network → confirm one `DELETE` per click and one `GET /api/v1/Books` after each.

**If you cannot reproduce the bug:** that is the answer. Write that finding in your code review comment.

---

## Step 4 — Write the prevention checklist (the real deliverable)

Even though no code change is needed, document the checklist. Add a brief comment at the top of your local copy (or in your PR description) like:

```tsx
// Code review — challenge-2-bug.tsx
// ✅ Read and invalidation share getApiV1BooksQueryKey().
// ✅ onSuccess invalidates, no setQueryData, no rollback.
// ✅ onError surfaces toast.error with server message.
// ✅ Mutation arg shape is { path: { id } } — matches generated type.
// ✅ No manual URL strings or hand-written cache keys.
// Conclusion: report could not be reproduced. Closing as Cannot Repro.
```

**Why this matters:** in a real platform team, "no change" PRs are valuable. They are the artifact that proves you investigated.

---

## Step 5 — What you _would_ have changed if the bug were real

For each of the three classic causes, the fix is:

| Bug pattern                                | Fix                                                                |
| ------------------------------------------ | ------------------------------------------------------------------ |
| Hand-written `["books"]` invalidation      | Replace with `getApiV1BooksQueryKey()`                              |
| Mismatched params in `getApiV1BooksQueryKey({...})` | Call it with the same args as the read                      |
| Optimistic update + invalidate fights       | Remove `onMutate`/`setQueryData`, rely on `onSuccess` + invalidate |

Memorize these — they are the patterns you will look for in 90% of "delete bug" tickets in any TanStack Query codebase.

---

## Step 6 — Verify in the browser one more time

1. Open the challenge.
2. Delete two books.
3. Open the React Query Devtools (look for the floating icon).
4. Inspect the `books` cache entry — its key should match exactly what `getApiV1BooksQueryKey()` returns, and its state should be "fresh" right after invalidation.

If everything matches: ✅ done.

---

## Code-change cheat sheet

| Action                  | Why                                                                |
| ----------------------- | ------------------------------------------------------------------ |
| **None.**               | The file already passes every requirement.                          |
| Document your findings  | A "cannot reproduce, here's why" review is a valid deliverable.     |
| Memorize the three patterns | They cover the majority of cache-race bugs you'll see in real code |

---

## Common mistakes (when this _kind_ of bug is real)

- **Inventing a query key as a literal string.** Always use the generated `xxxQueryKey()`.
- **Mixing `onMutate` (optimistic write) with `onSuccess` (invalidate).** Pick one strategy per mutation.
- **Invalidating with `refetchType: "none"`.** Looks like a refresh, isn't. Default behavior is what you want here.
- **Refreshing a different screen's key.** If the delete is on `Books`, do not refresh `Authors`.
