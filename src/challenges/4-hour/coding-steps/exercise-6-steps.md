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

**Why `useDeferredValue`:** typing updates `search` immediately, but the filtering work is
deferred to a later, interruptible render. The input stays responsive; the list lags by one
render pass.

**It is not a debounce, and it will not feel like one.** This trips up almost everyone, so read
the React docs on it before you judge whether your code works
([useDeferredValue → How is deferring a value different from debouncing and throttling?](https://react.dev/reference/react/useDeferredValue#how-is-deferring-a-value-different-from-debouncing-and-throttling)):

> There is no fixed delay caused by `useDeferredValue` itself. As soon as React finishes the
> original re-render, React will immediately start working on the background re-render with the
> new deferred value.

> Unlike debouncing or throttling, it doesn't require choosing any fixed delay. If the user's
> device is fast (e.g. powerful laptop), the deferred re-render would happen almost immediately
> and wouldn't be noticeable. If the user's device is slow, the list would "lag behind" the input
> proportionally to how slow the device is.

Consequences for this exercise:

- **You will not see a pause when you type.** Filtering 30 books costs about a millisecond, so
  the deferred pass lands in the same frame. Nothing to see is the *expected* result here — it is
  not evidence the hook is broken.
- The payoff is not a delay, it is that the keystroke never *blocks*. Measure the urgent pass
  (below) rather than looking for lag.
- Deferred re-renders are **interruptible**; a debounce is not. Per the docs, debouncing and
  throttling "merely postpone the moment when rendering blocks the keystroke."
- If you actually want fewer *network requests*, `useDeferredValue` is the wrong tool — the docs
  are explicit that debouncing and throttling are still the right choice for that, and that you
  can combine them.

**⚠️ The part everyone gets wrong — and React Compiler does not fix it.**

Calling the hook is not enough. If the filter sits inline in the same component as the
`<input value={search}>`, React Compiler groups them into a **single reactive scope**, and you
can read the dependency list straight out of the compiled output:

```js
// compiled from the naive version
if ($[2] !== books || $[3] !== deferredSearch || $[4] !== isFetching
    || $[5] !== page || $[6] !== search) {          //  <-- urgent `search` is a dependency
  const filteredBooks = books.filter(/* ... */);    //  <-- so this re-runs every keystroke
```

`search` changes on every keystroke, the guard fails, and the filter runs on the **urgent**
(blocking) pass — precisely what `useDeferredValue` exists to prevent.

Measure it. Make the filter briefly expensive and time the keystroke, which is synchronous:

```js
const t0 = performance.now();
input.dispatchEvent(new Event("input", { bubbles: true }));
console.log(performance.now() - t0); // time blocked on the urgent pass
```

On this screen that reads **~90ms per keystroke**. Typing visibly stutters.

**The fix is a component boundary, not more memoization.** Move filter + slice + list into a
child that receives the *deferred* term as a prop:

```tsx
<BookResults key={deferredSearch} books={books} search={deferredSearch} />
```

Now the compiled scope depends only on `[books, page, search]` where `search` is the deferred
term, and the parent caches the child element on `[books, deferredSearch]`. During the urgent
pass both are unchanged, so React reuses the cached element and skips the subtree outright.
Same expensive filter, same keystroke: **~1ms**.

**Do not reach for `memo` or `useMemo`.** With React Compiler on they are noise — the compiler
already emits the caching. If hand-memoizing seems necessary, the component boundary is in the
wrong place. Fix the boundary instead.

**Bonus: `key` replaces the page-reset.** `key={deferredSearch}` remounts the results on a new
search term, so paging resets to 1 for free — no `setPage(1)` on the urgent path, no
resynchronizing `useEffect`.

**Make the deferral visible.** Compare the two values and tell the user:

```tsx
const isStale = search !== deferredSearch;
```

Dim the list and show `filtering…` while `isStale`. On 30 books the deferral is well under a
frame, so without this indicator a student cannot tell the hook is wired up at all — which is
exactly why this exercise looks broken until you add it.

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
3. **`items`** — slice the filtered array to the current page. Order matters: **filter before slice**. Slicing the unfiltered array would give you page 1 of all books, not page 1 of the search matches.
4. **`pageCount`** — `Math.max(1, ...)` ensures the UI always shows at least "Page 1 / 1" even when there are zero results. Without it, an empty search would show "Page 1 / 0", which looks broken.
5. **`filteredBooks.length`** — number of matches, displayed in the header.

The logic here is already right. What is wrong is *where it lives*: this block sits in the same
component as the search input, which is what breaks the deferral (Step 1). In the finished
solution this exact code moves into the results child, unchanged apart from reading the deferred
term and the clamped page.

---

## Step 4 — Confirm "reset to page 1 when search changes"

In the input's `onChange`:

**Why this is required:** if the user is on page 4 of "harry" results and changes the search to
"lord", page 4 of "lord" might not exist.

Once paging lives inside the results component, you get the reset for free by keying the child
on the deferred term:

```tsx
<BookResults key={deferredSearch} books={books} search={deferredSearch} />
```

A changed `key` remounts the child, so its `useState(1)` re-initialises to page 1. No `setPage`
on the urgent path, and no `useEffect` to resynchronise two pieces of state.

---

## Step 5 — Confirm "page boundaries stay valid"

The Next/Prev buttons are disabled correctly:

```tsx
<button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
<button disabled={page >= pageCount} onClick={() => setPage(page + 1)}>Next</button>
```

Disabling the buttons is necessary but not sufficient. `page` is state, and state can go stale
against a result set that shrank underneath it — a background refetch returning fewer books, or
the deferred filter catching up. Clamp on read rather than trusting the stored value:

```tsx
const pageCount = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
const safePage = Math.min(page, pageCount);
```

Then slice, label, and gate the buttons with `safePage`. Page 4 of a 2-page result now renders
page 2 instead of an empty list, with no extra `useEffect` to resynchronize state.

---

## Step 6 — Confirm `isFetching` is rendered

Two different "not settled yet" signals, and they mean different things:

- `isFetching` — the **server** round-trip is in flight (background refetch).
- `isStale` — the **client** filter has not caught up with what you typed.

Both belong in the **parent**, next to the input, because both describe the term you just typed:

```tsx
<div className="text-muted-foreground flex justify-end gap-2 text-xs">
  {isFetching && <span>refreshing…</span>}
  {isStale && <span>filtering…</span>}
</div>
```

The match count and page indicator stay in the results child, since they describe the deferred
result set:

```tsx
<span className="text-xs opacity-70">
  {filteredBooks.length} matches · Page {safePage} / {pageCount}
</span>
```

Rendering only `isFetching` is what makes the deferral invisible to the user.

---

## Step 7 — The final shape

Splitting the deferred consumer out is not cosmetic — it is the fix. The finished screen is two
components with a clear division of labour:

**Parent (urgent):** owns `search`, renders the input, derives `isStale`, runs the query.

```tsx
const [search, setSearch] = useState("");
const deferredSearch = useDeferredValue(search);
const isStale = search !== deferredSearch;
const { data: books, isFetching } = useSuspenseQuery(getApiV1BooksOptions());
```

**Child (deferred):** owns `page`, filters, slices, and renders the pagination row plus the list.

```tsx
<div className="flex items-center justify-between">
  <button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage === 1} className="rounded border px-3 py-1 disabled:opacity-50">
    Prev
  </button>
  <span className="text-xs opacity-70">
    {filteredBooks.length} matches · Page {safePage} / {pageCount}
  </span>
  <button onClick={() => setPage(Math.min(pageCount, safePage + 1))} disabled={safePage >= pageCount} className="rounded border px-3 py-1 disabled:opacity-50">
    Next
  </button>
</div>
```

Note the handlers step from `safePage`, not from raw `page`. If `page` ever drifts past the end
of a shrunken result set, stepping from the clamped value keeps Prev/Next on pages that exist.

The rule to take away: **a deferred value wants its own component.** Anything else sharing a
render scope with the urgent value drags that urgent value into the scope's dependencies, and
the deferral silently stops working — compiler or no compiler.

---

## Step 8 — Delete the `// TODO:` header

```tsx
// TODO:
// 1. Start from getApiV1BooksOptions() ...
// 2. Keep paging local ...
// 3. Remove manual prefetching ...
// 4. Make useDeferredValue actually pay off (split the consumer into its own component,
//    pass it the deferred term, surface the stale flag).
// 5. Clamp the page against pageCount.
```

Delete it once you have confirmed every bullet.

---

## Step 9 — Verify in the browser

### See the deferral (CPU throttle)

On a modern laptop the deferred pass finishes in about a millisecond, so **you will not see
anything** at normal speed — that is expected, not a bug. The React docs put it plainly: on a
fast device "the deferred re-render would happen almost immediately and wouldn't be noticeable",
and on a slow one "the list would lag behind the input proportionally to how slow the device is".

So simulate the slow device:

1. DevTools → **Performance** → **CPU: 6x slowdown** (or 20x).
2. Type into the search box.
3. Watch the two halves come apart: the **input updates on every keystroke**, while the **list
   lags behind and dims**. That gap is `useDeferredValue` doing its job.
4. Remove the throttle — the gap disappears.

The dimming uses the docs' own delayed transition (`opacity 0.2s 0.2s linear`), so it stays
invisible on fast machines and only shows up when the deferral actually lasts long enough to
matter.

> **Do not expect debounce-like behaviour.** There is no timer here. React starts the background
> render immediately and simply lets keystrokes interrupt it. If you want *fewer network
> requests*, that is a debounce/throttle job — the docs say so explicitly.

### Correctness checks

1. Make the filter briefly expensive and time a keystroke (see Step 1). It should block for
   **~1ms**, not ~90ms. If it is still ~90ms the filter is reading `search` rather than
   `deferredSearch`, or it is still inline in the component that renders the input.
2. Search `Book 1` — 11 matches, 2 pages.
3. Click Next — the page indicator updates and Next disables on the last page.
4. Change the search while on page 2 — page resets to 1.
5. DevTools → Network → confirm exactly **one** `GET /api/v1/Books` powers the whole session.
   Every keystroke and page click is derived from that single cache entry — typing triggers no
   requests at all, which is also why there is nothing to "wait" for.

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
