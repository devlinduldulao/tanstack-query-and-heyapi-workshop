# Exercise 5 — Step-by-Step

> Goal: connect a generated create-book mutation to the **same** generated books-list identifier so the visible list refreshes automatically after a successful create.

You are editing [`exercise-5.tsx`](../exercise-5.tsx). Reference: [`solutions/exercise-5-end.tsx`](../solutions/exercise-5-end.tsx).

The starter already lists books and fires the create mutation. It does **not** toast or invalidate the generated list key. Clicking **Add** should feel unfinished until those handlers exist — then **Show Solution** matches.

---

## Mental model first

The bug this exercise prevents: **a successful write that leaves the list stale**.

In a manual-API codebase, the fix is to invent a key like `["books"]` for the list and `invalidate(["books"])` after the write. The problem is that nothing _forces_ the read and the invalidation to agree — typos and refactors silently break invalidation.

With Hey API, the **same generated `getApiV1BooksQueryKey()` is used by the read and the invalidation**, so there is no way for them to drift.

---

## Step 1 — Read the TODO header

```tsx
// TODO:
// 1. Use useQueryClient()
// 2. In useMutation onSuccess, invalidate getApiV1BooksQueryKey().
// 3. Show toast.success(...) on success and toast.error(...) on failure.
// 4. Do not manually prepend records into the cache.
```

None of these are in the starter mutation yet. Add `useQueryClient`, `getApiV1BooksQueryKey()`, toasts, and invalidation. Then optionally extract `queryKey` to a local variable and skip empty titles, to match the solution.

---

## Step 2 — Add the read + mutation wiring

```tsx
const queryClient = useQueryClient();
const { data } = useSuspenseQuery(getApiV1BooksOptions());

const mutation = useMutation({
  ...postApiV1BooksMutation(),
  onSuccess: () => {
    toast.success("Book created");
    void queryClient.invalidateQueries({ queryKey: getApiV1BooksQueryKey() });
  },
  onError: (error) => {
    toast.error(`Create failed: ${error.message}`);
  },
});
```

Three things to verify:

1. The read uses `getApiV1BooksOptions()`, which internally calls `getApiV1BooksQueryKey()`. Same key on both sides → invalidation reaches the read.
2. `onSuccess` toasts and invalidates. Order does not affect correctness; toasting first is just nicer UX.
3. `onError` surfaces the server's message.

No `onMutate`, no `setQueryData`, no manual prepend. The whole feature is two handlers.

---

## Step 3 — Extract `queryKey` to a local variable

This is a small readability win. Change:

```tsx
const queryClient = useQueryClient();
// ...
onSuccess: () => {
  toast.success("Book created");
  void queryClient.invalidateQueries({ queryKey: getApiV1BooksQueryKey() });
},
```

to:

```tsx
const queryClient = useQueryClient();
const queryKey = getApiV1BooksQueryKey();
// ...
onSuccess: () => {
  toast.success("Book created");
  void queryClient.invalidateQueries({ queryKey });
},
```

**Why this matters:**

- If you later add a second invalidation (e.g. a "books by author" related query), you have a single local `queryKey` to reference.
- The mutation closure is shorter and easier to scan.
- It mirrors the pattern used in the delete exercise (Exercise 6) and the bug challenge — consistency across the codebase.

---

## Step 4 — Guard against empty submits

Starter's click handler:

```tsx
<button
  onClick={() =>
    mutation.mutate({
      body: { id: 0, title, description: "", pageCount: 1, excerpt: "", publishDate: new Date().toISOString() },
    })
  }
  className="rounded border px-3 py-1"
>
  Add
</button>
```

Solution adds an `if (title)` guard and clears the input:

```tsx
<button
  onClick={() => {
    if (title) {
      mutation.mutate({
        body: { id: 0, title, description: "", pageCount: 1, excerpt: "", publishDate: new Date().toISOString() },
      });
    }
    setTitle("");
  }}
  className="rounded border px-3 py-1"
>
  Add
</button>
```

**Three things to notice:**

1. **`if (title)`** — refuses to submit when the input is empty. Without it, the user can spam-create empty books. (Real form validation comes in Exercise 11.)
2. **`setTitle("")` runs even when validation fails.** Debatable — the solution chose to always clear so the input is ready for the next attempt. If you prefer "preserve the typed text on validation fail", move `setTitle("")` inside the `if`. Either is defensible; match the solution for diff cleanliness.
3. **The whole handler is one statement** when wrapped in `{ ... }` — that's why the `() =>` is followed by braces, not the implicit-return parens.

---

## Step 5 — Confirm imports

Starter:

```tsx
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
```

Solution merges them:

```tsx
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
```

Purely cosmetic — one import line instead of two. The lint rule `no-duplicate-imports` would catch the duplication eventually.

---

## Step 6 — Delete the `// TODO:` header

Remove the four-line block.

---

## Step 7 — Verify in the browser

1. Save.
2. Open Exercise 5.
3. Type a title, click **Add**.
4. Success toast appears.
5. The list below should automatically refresh and include (or at least update) the books — `POST /api/v1/Books` followed by a `GET /api/v1/Books` in DevTools Network.
6. Click **Add** with an empty title → nothing happens (guarded).
7. Block the network call in DevTools and resubmit → error toast, no list refresh.

---

## Code-change cheat sheet

| Change                                                  | Required? |
| ------------------------------------------------------- | --------- |
| Add `const queryKey = getApiV1BooksQueryKey();`         | ✅ yes (matches solution + Exercise 6 pattern) |
| Use `{ queryKey }` shorthand in `invalidateQueries`     | ✅ yes    |
| Wrap mutation call in `if (title) { ... }` + `setTitle("")` | ✅ yes |
| Merge duplicate `@tanstack/react-query` imports         | optional  |
| Delete `// TODO:` header                                | ✅ yes    |

---

## Common mistakes

- **`invalidateQueries({ queryKey: ["books"] })`.** Always use the generated key.
- **Calling `setQueryData` to prepend the new book.** Forbidden by rule 4. Invalidate and let the refetch be the source of truth.
- **Putting the invalidation inside `onError`.** That fires after a _failed_ create — there is nothing new to fetch.
- **Forgetting to clear the input.** Annoying UX; the second submit reuses the same title.
