# Exercise 3 — Step-by-Step

> Goal: confirm a books list cleanly distinguishes **first load**, **background refresh**, and **user-triggered refresh** — three different UX states that all live on the same generated query.

You are editing [`exercise-3.tsx`](../exercise-3.tsx). Reference: [`solutions/exercise-3-end.tsx`](../solutions/exercise-3-end.tsx).

The starter is already functionally correct. This is mostly a reading/verification exercise plus one minor polish edit. The real lesson here is about **state separation** — knowing why `isFetching`, the suspense fallback, and the manual refresh button each show different UI even when the underlying query is the same.

---

## Mental model first

A query has three observable states from the UI's point of view:

| State                  | Driven by                              | UI treatment                          |
| ---------------------- | -------------------------------------- | ------------------------------------- |
| First load (cold)      | suspense (no cached data yet)          | Full-region fallback                  |
| Background refresh     | `isFetching` while cached data exists  | Small inline indicator                |
| User-triggered refresh | `invalidateQueries` from the UI        | The same inline indicator, _not_ a full-region fallback |

The key insight: a user-triggered refresh should **not** look like a first load. If you blank the screen on every click, the app feels slow even when the network is fine.

---

## Step 1 — Read the TODO header

```tsx
// TODO:
// 1. Show a suspense fallback when the list is cold.
// 2. Show a "Refreshing..." badge when isFetching.
// 3. Add an error fallback with a retry affordance at the nearest boundary.
// 4. Add a Refresh button that invalidates the query unconditionally.
```

Items 2 and 4 are already implemented in the starter. Items 1 and 3 are handled by the **route shell** that mounts this component — there is an outer `<Suspense>` and an outer `<ErrorBoundary>` already in play. You do not need to add them inside this file unless you want a localized boundary.

---

## Step 2 — Confirm the query

```tsx
const queryClient = useQueryClient();
const { data, isFetching } = useSuspenseQuery(getApiV1BooksOptions());
```

`useSuspenseQuery` makes `data` non-nullable. The first render either suspends (cold cache) or returns data immediately (warm cache). Either way, by the time the JSX runs, `data` is an array.

---

## Step 3 — Confirm the refresh button + indicator

```tsx
<button
  onClick={() => void queryClient.invalidateQueries({ queryKey: getApiV1BooksQueryKey() })}
  className="rounded border px-2 py-1 text-xs"
>
  Refresh
</button>
{isFetching && <span className="text-xs opacity-60">Refreshing...</span>}
```

Three things to verify:

1. **`getApiV1BooksQueryKey()`** — the same generated key that powers the read above. If you typed a manual `["books"]` here, the invalidation would miss and the button would be silently dead.
2. **`void` operator** — `invalidateQueries` returns a Promise. The `void` operator silences the floating-promise lint rule because we do not need to await the refetch.
3. **`isFetching` indicator** — covers both the post-click refetch and any automatic background refetches. Same indicator, both cases. That is the unified UX the lesson is teaching.

---

## Step 4 — The single polish edit: add spacing to the list

Starter:

```tsx
<ul>
  {data.slice(0, 5).map((b) => (
    <li key={b.id}>{b.title}</li>
  ))}
</ul>
```

Solution:

```tsx
<ul className="space-y-1">
  {data.slice(0, 5).map((b) => (
    <li key={b.id}>{b.title}</li>
  ))}
</ul>
```

Add `className="space-y-1"` to the `<ul>`. **Why:** without it, the list items are visually glued together. `space-y-1` is the Tailwind utility for "4px vertical gap between adjacent children". It's cosmetic but matters — readable spacing is part of the UX requirement.

---

## Step 5 — (Optional) Add a local ErrorBoundary

The instructions mention "an error fallback with a retry affordance at the nearest boundary". The route shell already provides one, but if you want to demonstrate the pattern locally, you can wrap the JSX in `react-error-boundary` (already a project dependency — see Exercise 10 for the full pattern). For this exercise the route shell is enough.

---

## Step 6 — Delete the `// TODO:` header

Remove the four-line block once `space-y-1` is added and you have verified the other items live in the route shell.

---

## Step 7 — Verify in the browser

1. Save.
2. Open Exercise 3.
3. List renders.
4. Click **Refresh** → DevTools → Network shows a fresh `GET /api/v1/Books`. The "Refreshing..." badge appears for the duration of the request, then disappears.
5. The list does **not** vanish during the refresh — that is the success criterion of the lesson.
6. (Optional) In React Query Devtools, manually mark the query as stale and watch the same indicator appear when you focus the tab.

---

## Code-change cheat sheet

| Change                                               | Required? |
| ---------------------------------------------------- | --------- |
| Add `className="space-y-1"` to the `<ul>`            | ✅ yes    |
| Delete `// TODO:` header                             | ✅ yes    |
| Wrap in a local `<ErrorBoundary>`                    | optional (route shell already provides one) |
| Anywhere else                                        | leave alone |

---

## Common mistakes

- **Wrapping `useSuspenseQuery` in `try/catch`.** Suspense errors propagate to the nearest error boundary. Catching here breaks that.
- **Using `useQuery` so you can render your own "Loading" state.** Defeats the point of the route's suspense shell. Use `useSuspenseQuery` and let the boundary handle cold load.
- **Showing the suspense fallback on the Refresh click.** That is what "do not replace the whole screen with a blocking loading state" prohibits. Use `isFetching`.
