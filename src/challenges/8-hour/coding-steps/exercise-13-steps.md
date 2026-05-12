# Exercise 13 — Step-by-Step

> Goal: prove that **one generated read** is enough to power search + pagination, by deriving the visible view locally with `useDeferredValue`.

You are editing [`exercise-13.tsx`](../exercise-13.tsx). Reference: [`solutions/exercise-13-end.tsx`](../solutions/exercise-13-end.tsx).

The starter and the solution are functionally identical. Every requirement is met. The only differences are **layout polish** in the JSX and removing the `// TODO:` header. This is a code-review pass.

---

## Mental model first

Two ways to do search + pagination:

1. **Server-driven** — pass `page`, `pageSize`, and `search` to the API. Server returns one page at a time. Query key includes those parameters; cache entries are paginated.
2. **Client-derived** — fetch the whole list once, filter and slice in memory. One cache entry powers every view.

The backend in this workshop returns the full books list, so **option 2** is the right choice. Three things make it work cleanly:

| Concern         | Tool                                  |
| --------------- | ------------------------------------- |
| Typing latency  | `useDeferredValue`                    |
| Filter ordering | filter → slice (not the reverse)      |
| Cache identity  | One generated `getApiV1BooksOptions()` |

If the backend later adds real query parameters, you swap the local filter for query params and the screen logic stays nearly the same.

---

## Step 1 — Confirm the state hooks

```tsx
const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
const deferredSearch = useDeferredValue(search);
```

**Why `useDeferredValue`:** typing updates `search` immediately, but filtering is deferred to a later render. Input stays responsive; the list "lags by one frame" while React filters in the background. React 19's built-in answer to "debounce typing without writing a debounce".

**Why a separate variable:** clarity. You _could_ inline `useDeferredValue(search)`, but pulling it out names the concept.

---

## Step 2 — Confirm the single query

```tsx
const { data: books, isFetching } = useSuspenseQuery(getApiV1BooksOptions());
```

One query, one generated key, no parameters because the whole dataset comes in one response. Nothing to change.

---

## Step 3 — Confirm the derive-locally block

```tsx
const normalizedSearch = deferredSearch.trim().toLowerCase();
const filteredBooks = books.filter((book) => book.title?.toLowerCase().includes(normalizedSearch));
const data: BooksPage = {
  items: filteredBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  pageCount: Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE)),
  total: filteredBooks.length,
};
```

Read it line by line:

1. **`normalizedSearch`** — trim + lowercase once. Without this, you would re-lowercase the search string on every filter iteration.
2. **`filteredBooks`** — case-insensitive title match. `?.` guards against books with no title.
3. **`data.items`** — slice the filtered array to the current page. **Filter before slice.**
4. **`data.pageCount`** — `Math.max(1, ...)` ensures the UI always shows at least "Page 1 / 1" even when there are zero results.
5. **`data.total`** — match count for the header.

---

## Step 4 — Confirm "reset to page 1 when search changes"

```tsx
onChange={(event) => {
  setSearch(event.target.value);
  setPage(1);
}}
```

**Why required:** if the user is on page 4 of "harry" results and types "lord", page 4 of "lord" might not exist. Force back to page 1 to keep the UI valid.

---

## Step 5 — Confirm pagination boundary protection

```tsx
<button disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Prev</button>
<button disabled={page >= (data?.pageCount ?? 1)} onClick={() => setPage((value) => value + 1)}>Next</button>
```

The `?? 1` fallback keeps the boundary check sane during any momentary `undefined`.

---

## Step 6 — Confirm `isFetching` indicator

```tsx
<span>Page {page} / {data?.pageCount ?? 1} {isFetching && "· refreshing…"}</span>
```

Background-refresh feedback. Same idea as Exercise 1 and 3.

---

## Step 7 — Decide whether to restructure the JSX

The **starter** layout (top-down):

1. search input
2. status line
3. results list
4. Prev / Next buttons (bottom)

The **solution** moves the status line _into_ the pagination row:

1. search input
2. row: `[Prev] [status text] [Next]`
3. results list

Both work. For a clean diff, copy the solution's pagination row pattern. The key block becomes:

```tsx
<div className="flex items-center justify-between">
  <button
    onClick={() => setPage((p) => Math.max(1, p - 1))}
    disabled={page === 1}
    className="rounded border px-3 py-1 disabled:opacity-50"
  >
    Prev
  </button>
  <span className="text-xs opacity-70">
    {data?.total ?? 0} matches · Page {page} / {data?.pageCount ?? 1} {isFetching && "· refreshing…"}
  </span>
  <button
    onClick={() => setPage((p) => Math.min(data?.pageCount ?? 1, p + 1))}
    disabled={page >= (data?.pageCount ?? 1)}
    className="rounded border px-3 py-1 disabled:opacity-50"
  >
    Next
  </button>
</div>
```

Note the solution also adds `Math.max(1, p - 1)` and `Math.min(data?.pageCount ?? 1, p + 1)` inside the click handlers — belt-and-suspenders defense in case `disabled` is bypassed.

---

## Step 8 — Delete the `// TODO:` header

Remove the four-line block.

---

## Step 9 — Verify in the browser

1. Save.
2. Type quickly in the search box — input feels snappy because filtering is deferred.
3. Search for "the" — total matches > 10, pagination active.
4. Click Next a few times — page indicator updates, button disables at the last page.
5. Change search while on page 3 — page resets to 1.
6. DevTools → Network → exactly **one** `GET /api/v1/Books` powers the entire session.

---

## Code-change cheat sheet

| Change                                                | Required? |
| ----------------------------------------------------- | --------- |
| Delete `// TODO:` header                              | ✅ yes    |
| Restructure status into the pagination row            | optional  |
| Add `Math.max`/`Math.min` inside pagination handlers  | optional  |
| Anywhere else                                         | leave alone |

---

## Common mistakes

- **Slicing before filtering.** Always filter first, slice second.
- **Debouncing with `setTimeout`.** `useDeferredValue` does this for free with React-aware scheduling.
- **Adding `enabled: search.length > 0`.** The whole point is one query that always runs. Search is a _view_, not a different query.
- **Querying per page.** Tempting if you come from server-paged backgrounds, but it defeats the cache.
