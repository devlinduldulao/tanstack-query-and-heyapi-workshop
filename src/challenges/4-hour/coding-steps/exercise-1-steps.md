# Exercise 1 — Step-by-Step

> Goal: turn a starter file that uses the generated books read helper but with **production-unsafe** cache settings into a screen-level query with sane defaults, a derived view, and visible background-refresh state.

You are editing [`exercise-1.tsx`](../exercise-1.tsx). The reference output is [`solutions/exercise-1-end.tsx`](../solutions/exercise-1-end.tsx) — read it _only after_ you have attempted each step.

The component already has the right imports and the right overall shape. **You are not rewriting the file.** You are changing a handful of values inside the `useSuspenseQuery({ ... })` options object and removing the leading `// TODO:` block.

---

## Mental model first (read this before touching code)

`useSuspenseQuery` always needs an _options object_. Hey API generated `getApiV1BooksOptions()` which returns one of those objects pre-filled with:

- the right `queryKey`
- the right `queryFn`
- the right type information

When you spread `...getApiV1BooksOptions()` into your own options object, you can override **only** the screen-level concerns: `staleTime`, `gcTime`, `retry`, and `select`. That is the whole point — you keep the contract-owned bits and customize only the UI-owned bits.

So the order of work is:

1. Tune cache freshness (`staleTime`, `gcTime`).
2. Tune resilience (`retry`).
3. Confirm the `select` transform is correct.
4. Confirm the UI surfaces freshness state (`dataUpdatedAt`, `isFetching`).
5. Remove the TODO header.

That is the order below.

---

## Step 1 — Read the requirements, then locate the override block

Open [`instructions/exercise-1.md`](../instructions/exercise-1.md). The four screen rules are:

- `staleTime`: **60 seconds**
- `gcTime`: **15 minutes**
- `retry`: at most **2 retries**
- transform: books with ≥ 200 pages, sorted by `pageCount` desc

Now open [`exercise-1.tsx`](../exercise-1.tsx) and find this block inside `Exercise1`:

```tsx
const {
  data = [],
  dataUpdatedAt,
  isFetching,
} = useSuspenseQuery({
  ...getApiV1BooksOptions(),
  staleTime: 0,
  gcTime: 5 * 60 * 1000,
  retry: 0,
  select: (books) => /* ... */,
});
```

Every change in this exercise happens inside that object. **Do not** touch the imports, do not touch `formatUpdatedAt`, do not touch the JSX. Resist the urge to "tidy up" — staying inside one block keeps the diff small and the lesson focused.

---

## Step 2 — Fix `staleTime` first

**Why first:** `staleTime` controls how long the cached data is considered _fresh_. While fresh, TanStack Query will not refetch on mount, focus, or reconnect. This is the single most impactful knob for perceived performance, so it is the right place to start.

Change:

```tsx
staleTime: 0,
```

to:

```tsx
staleTime: 60 * 1000, // 60 seconds, expressed in milliseconds
```

**Why write `60 * 1000` and not `60000`:** the multiplication form documents the unit at the call site. A junior dev reading this in six months knows immediately that we mean 60 seconds, not 60,000 milliseconds-or-some-other-thing.

**Why not just zero:** `staleTime: 0` means _every_ mount triggers a refetch. On a list page that re-mounts when you tab away and back, this is a flood of redundant requests for data that almost certainly has not changed.

---

## Step 3 — Fix `gcTime` second

**Why second:** `gcTime` ("garbage-collection time") controls how long an _inactive_ query stays in the cache after the last component unsubscribes. It is independent of `staleTime`, and it only matters when you navigate _away_ from the screen and come back. Fix it now while you are still in the cache-policy mindset.

Change:

```tsx
gcTime: 5 * 60 * 1000,
```

to:

```tsx
gcTime: 15 * 60 * 1000, // 15 minutes
```

**Why 15 minutes:** when the user navigates Books → Authors → Books, you want the Books list to render instantly from cache, then refetch in the background. 5 minutes is too short for a list that does not change often; 15 minutes gives a great cache-hit ratio without holding stale data forever.

---

## Step 4 — Fix `retry` third

**Why third:** retries only matter when requests fail. The requirement is "at most 2 retries". You can express that as a number (`2`) or as a predicate function (`(failureCount) => failureCount < 2`). The solution file uses the predicate form because it composes better with future conditions like "retry only on network errors".

Change:

```tsx
retry: 0,
```

to:

```tsx
retry: (failureCount) => failureCount < 2,
```

**Why the function form:** if the backend returns a `404`, you do not want to retry — there is no book at that ID. Later you can extend this to `(failureCount, error) => failureCount < 2 && error.status !== 404`. Starting with the function form means that future change is a one-line edit, not a refactor.

---

## Step 5 — Confirm the `select` transform

Open the `select` and read it carefully. It already does the three required operations in the right order:

```tsx
select: (books) =>
  books
    .filter((book) => (book.pageCount ?? 0) >= MIN_PAGES) // 1. keep ≥200 pages
    .sort((left, right) => (right.pageCount ?? 0) - (left.pageCount ?? 0)) // 2. descending
    .slice(0, 10), // 3. cap at 10
```

**Why the order matters:**

- _Filter before sort_ — sorting is `O(n log n)`. Filtering first means we sort a smaller array.
- _Sort before slice_ — slicing first would give us the first 10 of the _original_ order, not the top 10 by page count.

If you ever rearrange these, the screen silently shows the wrong books. There is nothing to change here, but you should be able to explain the order out loud before moving on.

**Why use `select` and not transform in the component body:** `select` runs inside the query, so the cache stores the full server payload and only the _derived_ output triggers re-renders. If the transform produces the same reference, React skips the re-render entirely.

---

## Step 6 — Confirm the JSX already surfaces freshness

Scroll to the JSX. The starter already destructures `dataUpdatedAt` and `isFetching` and renders both:

```tsx
<span>Updated: {formatUpdatedAt(dataUpdatedAt)}</span>
{isFetching && <span>Refreshing in background…</span>}
```

**Why this matters:** with a 60-second `staleTime`, refetches happen silently in the background. Without the `isFetching` indicator, the user has no idea the screen is alive. The instruction "Show clearly when the screen is refreshing" is satisfied by this two-line pattern — confirm it is present and do not remove it.

---

## Step 7 — Delete the `// TODO:` comment block at the top

Now that every requirement is satisfied, remove these lines:

```tsx
// TODO:
// 1. Start from getApiV1BooksOptions() instead of a hand-written request.
// 2. Keep the generated query key and derive the filtered catalog with select.
// 3. Tune staleTime, gcTime, and retry for a production list.
// 4. Let Hey API own the transport layer and DTO shape.
```

**Why last:** the comments are your checklist. Deleting them is the symbolic "I'm done" — and it also keeps the diff against the solution file clean.

---

## Step 8 — Verify in the browser

1. Save the file.
2. In the bootcamp UI, open Exercise 1.
3. You should see a list of books, the "Updated: HH:MM:SS" timestamp, and — if you wait a minute and click away/back — the "Refreshing in background…" label.

Open DevTools → Network and confirm:

- A single `GET /api/v1/Books` happens on first mount.
- No new request fires on a quick remount within the 60-second window.
- After 60 seconds, refocusing the tab triggers a background refetch.

If any of that is missing, your `staleTime` or `gcTime` is wrong — go back to Step 2 or 3.

---

## Code-change cheat sheet

| Line                            | Before                  | After                                          | Why                                      |
| ------------------------------- | ----------------------- | ---------------------------------------------- | ---------------------------------------- |
| `staleTime`                     | `0`                     | `60 * 1000`                                    | 60s fresh window stops refetch floods    |
| `gcTime`                        | `5 * 60 * 1000`         | `15 * 60 * 1000`                               | keep inactive cache for 15 min           |
| `retry`                         | `0`                     | `(failureCount) => failureCount < 2`           | max 2 retries, predicate form for future |
| `// TODO:` block (top of file)  | present                 | _deleted_                                      | checklist complete                       |

Everything else stays exactly as the starter has it.

---

## Common mistakes

- **Hand-writing the query key.** `getApiV1BooksOptions()` already provides the right `queryKey`. If you add a hardcoded `queryKey: ["books"]` anywhere, you broke the contract.
- **Moving the filter into the JSX.** Filtering in JSX runs on every render. Filtering in `select` runs only when the underlying cache changes — much cheaper.
- **Using `useQuery` instead of `useSuspenseQuery`.** The route wraps this in a Suspense boundary, so `useSuspenseQuery` is correct and gives you a non-nullable `data`.
