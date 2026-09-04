# Exercise 13 — Step-by-Step

> Goal: prove that **one generated read** is enough to power search + pagination, by deriving the visible view locally with `useDeferredValue`.

You are editing [`exercise-13.tsx`](../exercise-13.tsx). Reference: [`solutions/exercise-13-end.tsx`](../solutions/exercise-13-end.tsx).

The starter is a 10-item list and nothing else — no search box, no paging, no deferred value. **Show Solution** should search, page, and show a match count.

---

## Mental model first

Two ways to do search + pagination:

1. **Server-driven** — pass `page`, `pageSize`, and `search` to the API. Server returns one page at a time. Query key includes those parameters; cache entries are paginated.
2. **Client-derived** — fetch the whole list once, filter and slice in memory. One cache entry powers every view.

The backend in this workshop returns the full books list, so **option 2** is the right choice.

| Concern         | Tool                                   |
| --------------- | -------------------------------------- |
| Typing latency  | `useDeferredValue`                     |
| Filter ordering | filter → slice (not the reverse)       |
| Cache identity  | One generated `getApiV1BooksOptions()` |

---

## Step 1 — Add state

```tsx
import { useDeferredValue, useState } from "react";

const PAGE_SIZE = 10;

const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
const deferredSearch = useDeferredValue(search);
```

Keep the existing `useSuspenseQuery(getApiV1BooksOptions())` — one query, no extra params.

---

## Step 2 — Derive the visible page locally

Filter **then** slice. Reset to page 1 when the search term changes. Clamp page count so an empty result still shows "Page 1 / 1".

```tsx
const normalizedSearch = deferredSearch.trim().toLowerCase();
const filteredBooks = books.filter((book) => book.title?.toLowerCase().includes(normalizedSearch));
const data = {
  items: filteredBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  pageCount: Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE)),
  total: filteredBooks.length,
};
```

---

## Step 3 — Render search, paging, and status

Match the solution layout: search input, Prev / match count / Next on one row, then the list.

```tsx
<input
  className="w-full rounded border px-2 py-1"
  placeholder="Search books"
  value={search}
  onChange={(event) => {
    setSearch(event.target.value);
    setPage(1);
  }}
/>
```

Disable Prev on page 1 and Next on the last page. Show `{isFetching && "· refreshing…"}` next to the page indicator.

---

## Step 4 — Delete the `// TODO:` header

Once search + paging work, remove the TODO block.

---

## Step 5 — Verify in the browser

1. Save. Open Exercise 13.
2. Starter (if you have not edited yet): a static 10-item list.
3. After your edits / **Show Solution**: type in search, page through matches, watch the count update.
4. Network: still exactly one `GET /api/v1/Books` for the whole session.

---

## Common mistakes

- **Slicing before filtering.** Always filter first, then slice.
- **Debouncing manually with `setTimeout`.** `useDeferredValue` does this without a timer.
- **Querying per page.** That would defeat the single generated cache entry.
