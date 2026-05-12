# Exercise 6 — Step-by-Step

> Goal: prove that **one generated read** is enough to power search + pagination, by deriving the visible view locally with `useDeferredValue`.

You are editing [`exercise-6.tsx`](../exercise-6.tsx). The reference output is [`solutions/exercise-6-end.tsx`](../solutions/exercise-6-end.tsx).

Spoiler: the starter and the solution are functionally identical. Every requirement is already met. The only differences are **layout polish** in the JSX and removal of the `// TODO:` header. This exercise is a code-review pass — your job is to confirm each requirement out loud, then optionally restructure the JSX to match the solution.

---

## Mental model first

There are two ways to do search + pagination:

1. **Server-driven** — pass `page`, `pageSize`, and `search` to the API. The server returns one page at a time. The query key includes those parameters, so cache entries are paginated.
2. **Client-derived** — fetch the whole list once, then filter and slice in memory. The query key has no parameters, so the cache has one entry that powers every view.

The backend in this workshop returns the full books list, so **option 2** is the right choice. Three things make it work cleanly:

| Concern         | Tool                            |
| --------------- | ------------------------------- |
| Typing latency  | `useDeferredValue`              |
| Filter ordering | filter → slice (not the reverse) |
| Cache identity  | One generated `getApiV1BooksOptions()` |

When the backend later adds real query parameters, you swap the local filter for query params and the screen logic stays nearly the same.

---

## Step 1 — Confirm the state hooks

At the top of the component:

```tsx
const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
const deferredSearch = useDeferredValue(search);
```

**Why `useDeferredValue`:** typing in the search box updates `search` immediately, but the filtering work is deferred to a later render. The input stays responsive; the list "lags by one frame" while React filters in the background. This is React 19's built-in answer to "debounce typing without writing a debounce".

**Why a separate `deferredSearch` variable:** clarity. You could read `useDeferredValue(search)` inline, but pulling it out names the concept so other engineers know why it exists.

---

## Step 2 — Confirm the single query call

```tsx
const { data: books, isFetching } = useSuspenseQuery(getApiV1BooksOptions());
```

One query, one generated key. The query has no parameters because the entire dataset comes back in one response. Nothing to change.

---

## Step 3 — Confirm the derive-locally block

```tsx
const normalizedSearch = deferredSearch.trim().toLowerCase();
const filteredBooks = books.filter((book: Book) => book.title?.toLowerCase().includes(normalizedSearch));
const data: BooksPage = {
  items: filteredBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  pageCount: Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE)),
  total: filteredBooks.length,
};
```

Read it line by line:

1. **`normalizedSearch`** — trim + lowercase once, so the per-row check is just `includes(normalizedSearch)`. Without this, you would re-lowercase the search string on every filter iteration.
2. **`filteredBooks`** — case-insensitive title match. The `?.` guards against books with no title (shouldn't happen per the spec, but defensive).
3. **`data.items`** — slice the filtered array to the current page. Order matters: **filter before slice**. Slicing the unfiltered array would give you page 1 of all books, not page 1 of the search matches.
4. **`data.pageCount`** — `Math.max(1, ...)` ensures the UI always shows at least "Page 1 / 1" even when there are zero results. Without it, an empty search would show "Page 1 / 0", which looks broken.
5. **`data.total`** — number of matches, displayed in the header.

Nothing to change in this block.

---

## Step 4 — Confirm "reset to page 1 when search changes"

In the input's `onChange`:

```tsx
onChange={(event) => {
  setSearch(event.target.value);
  setPage(1);
}}
```

**Why this is required:** if the user is on page 4 of "harry" results and changes the search to "lord", page 4 of "lord" might not exist. Forcing back to page 1 keeps the UI valid without crash-handling.

---

## Step 5 — Confirm "page boundaries stay valid"

The Next/Prev buttons are disabled correctly:

```tsx
<button disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Prev</button>
<button disabled={page >= (data?.pageCount ?? 1)} onClick={() => setPage((value) => value + 1)}>Next</button>
```

**Why the `??` fallback:** during the initial deferred-value mismatch, `data?.pageCount` could conceivably be undefined; the `?? 1` keeps the boundary check sane.

---

## Step 6 — Confirm `isFetching` is rendered

```tsx
<span>
  Page {page} / {data?.pageCount ?? 1} {isFetching && "· refreshing…"}
</span>
```

This is the background-refresh indicator. Same idea as Exercise 1.

---

## Step 7 — Decide whether to restructure the JSX

The **starter** lays out controls like this (top-down):

1. search input
2. status line
3. results list
4. Prev / Next buttons (bottom)

The **solution** moves the status line _into_ the pagination row, so the layout is:

1. search input
2. row: `[Prev] [status text] [Next]`
3. results list

Both work. If you want a clean diff against the solution, copy that pagination row pattern. **This is purely cosmetic** and not required by the instructions.

If you do restructure, the key block becomes:

```tsx
<div className="flex items-center justify-between">
  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded border px-3 py-1 disabled:opacity-50">
    Prev
  </button>
  <span className="text-xs opacity-70">
    {data?.total ?? 0} matches · Page {page} / {data?.pageCount ?? 1} {isFetching && "· refreshing…"}
  </span>
  <button onClick={() => setPage((p) => Math.min(data?.pageCount ?? 1, p + 1))} disabled={page >= (data?.pageCount ?? 1)} className="rounded border px-3 py-1 disabled:opacity-50">
    Next
  </button>
</div>
```

Note the solution also adds `Math.max(1, p - 1)` and `Math.min(data?.pageCount ?? 1, p + 1)` inside the click handlers — belt-and-suspenders defense in case the `disabled` attribute is ever bypassed.

---

## Step 8 — Delete the `// TODO:` header

```tsx
// TODO:
// 1. Start from getApiV1BooksOptions() so Hey API owns the request and query key.
// 2. Use useDeferredValue(search) before deriving the visible items.
// 3. Keep paging local because the API call is still the generated books list query.
// 4. Remove manual prefetching and let one shared query feed the derived UI state.
```

Delete it once you have confirmed every bullet.

---

## Step 9 — Verify in the browser

1. Save.
2. Type quickly in the search box — the input should feel snappy even on slow machines, because filtering is deferred.
3. Search for "the" — you should see total matches > 10 and pagination active.
4. Click Next a few times — page indicator updates, button disables at the last page.
5. Change search while on page 3 — page resets to 1.
6. DevTools → Network → confirm exactly **one** `GET /api/v1/Books` call powers the entire session.

---

## Code-change cheat sheet

| Change                                                | Required? | Why                                          |
| ----------------------------------------------------- | --------- | -------------------------------------------- |
| Delete `// TODO:` header                              | ✅ yes    | Acceptance complete                           |
| Restructure status into the pagination row            | optional  | Matches the solution                         |
| Add `Math.max`/`Math.min` inside pagination handlers  | optional  | Defense in depth                             |
| Anywhere else                                         | leave alone | Logic is correct                            |

---

## Common mistakes

- **Slicing before filtering.** Always filter first, then slice.
- **Debouncing manually with `setTimeout`.** `useDeferredValue` does this for free, with React-aware scheduling.
- **Adding `enabled: search.length > 0`.** The whole point is one query that always runs. The search is a _view_, not a different query.
- **Querying per page.** Tempting if you come from a server-paged background, but here it would defeat the cache.
