# Exercise 12 — Step-by-Step

> Goal: confirm a generated detail contract works as both **a render-on-demand source** and **a warm-cache participant**, without writing a manual prefetch button. The freshness window stays long enough that a second mount renders instantly from cache.

You are editing [`exercise-12.tsx`](../exercise-12.tsx). Reference: [`solutions/exercise-12-end.tsx`](../solutions/exercise-12-end.tsx).

The starter is functionally complete. There are two tiny **wording** edits in the cache-state label and the JSX structure. This is a code-review exercise plus the requirement that you _explain_ the route-loader mapping.

---

## Mental model first

The lesson is about **one generated options object** doing two jobs:

1. **Component-time render** — `useSuspenseQuery(getBookOptions())` runs when `BookPanel` mounts.
2. **Route-time prefetch** — the _same_ options object could be passed to a TanStack Router `loader` like `queryClient.ensureQueryData(getBookOptions())` to warm the cache before the component mounts.

With `staleTime: 60_000`, whichever path runs _first_ populates the cache; the other path renders instantly from the same key. No manual prefetch button. No duplicate fetcher. One contract, two consumers.

---

## Step 1 — Read the TODO header

```tsx
// TODO:
// 1. Keep the same generated options object for the rendered suspense query.
// 2. Remove manual prefetching and let the query run only when the panel mounts.
// 3. Show the difference between the first load and a background refetch on remount.
// 4. Map this shared-options pattern to a TanStack Router loader when preloading is desired.
```

Items 1, 2, 3 are already in the starter. Item 4 is documentation — you should be able to **explain** it out loud (see Step 5).

---

## Step 2 — Confirm `getBookOptions`

```tsx
const WARM_CACHE_TIME = 60 * 1000;

function getBookOptions() {
  return {
    ...getApiV1BooksByIdOptions({ path: { id: 1 } }),
    staleTime: WARM_CACHE_TIME,
  };
}
```

**Why this is a named function and not inline:** the whole lesson is "the same options object is reusable". Naming it makes that reuse visible. In a real app this lives in `src/hooks/use-book-options.ts` and is imported by:

- the component that mounts the panel (this file)
- a route `loader` that prefetches before mount (TanStack Router pattern)

Same function, two consumers, identical key.

---

## Step 3 — Confirm `BookPanel`

Starter:

```tsx
function BookPanel() {
  const { data, isFetching } = useSuspenseQuery(getBookOptions());

  return (
    <div className="rounded border p-3">
      <p className="text-muted-foreground text-xs">
        {isFetching ? "Fetching or refreshing..." : "Rendered from cache"}
      </p>
      <div className="mt-2">
        <p className="font-medium">{data.title}</p>
        <p className="text-muted-foreground mt-1 text-xs">{data.description}</p>
      </div>
    </div>
  );
}
```

Solution makes three tiny edits:

```tsx
function BookPanel() {
  const { data, isFetching } = useSuspenseQuery(getBookOptions());
  return (
    <div className="rounded border p-3">
      <p className="text-muted-foreground mb-2 text-xs">
        {isFetching ? "Fetching or refreshing..." : "Rendered from warm cache"}
      </p>
      <p className="font-medium">{data.title}</p>
      <p className="mt-1 text-xs opacity-80">{data.description}</p>
    </div>
  );
}
```

| Change                                         | Why                                                        |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `"Rendered from cache"` → `"Rendered from warm cache"` | More specific; reinforces the lesson title                 |
| Outer `<div className="mt-2">` removed         | `<p className="mt-1">` already provides spacing            |
| Indicator gets `mb-2` instead of separate wrapper | Same visual gap with one less DOM node                     |
| `text-muted-foreground` on description → `opacity-80` | Cosmetic; either is fine                                   |

Apply them to match the solution. They are not behavior changes.

---

## Step 4 — Confirm the toggle + Suspense in `Exercise12`

```tsx
const [enabled, setEnabled] = useState(false);
// ...
{enabled && (
  <Suspense fallback={<div className="rounded border p-3"><p>...Fetching or refreshing...</p></div>}>
    <BookPanel />
  </Suspense>
)}
```

The button sets `enabled = true`. Until then, no query exists. After click:

- **First click, cold cache** → suspense fallback briefly visible → `BookPanel` renders with `isFetching` flipping false.
- **Toggle off and on within 60 seconds** — wait, the starter has no toggle off. Click the button again — it stays `true`. The freshness demo is really about re-mounting via _route navigation_, not toggling in place.

That is a subtle point. To see the warm-cache effect for real, do this:

1. Click "Render book #1" → see "Fetching..." then content.
2. Navigate to a different exercise in the sidebar.
3. Navigate back to Exercise 12.
4. Click "Render book #1" again — instant render with "Rendered from warm cache" because the cached entry is still fresh (within `staleTime: 60_000`).

That round-trip is the demo. Mention it in your notes.

---

## Step 5 — Write your route-loader explanation (the "item 4" deliverable)

You will not write this in code, but you should be able to say it. Practice the sentence:

> "Because `getBookOptions()` returns a plain options object with `staleTime` baked in, a TanStack Router `loader` can call `void context.queryClient.ensureQueryData(getBookOptions())` before the route renders. By the time `BookPanel` mounts, the cache is already warm, so the suspense fallback never appears. Same generated key, same staleTime, two callers."

That is the senior-engineer answer. If you can say that out loud, item 4 is done.

You do not need to actually add a loader here — Exercise 12 stays component-mount-only. The point is that the **same options object** would work if you did.

---

## Step 6 — Delete the `// TODO:` header

Remove the four-line block.

---

## Step 7 — Verify in the browser

1. Save.
2. Open Exercise 12.
3. Click "Render book #1" → see the suspense fallback briefly, then the panel with "Rendered from warm cache" (or "Fetching or refreshing..." if you caught the moment before resolution).
4. Navigate away in the sidebar.
5. Within 60 seconds, navigate back and click again — should render essentially instantly because the cache entry is still fresh.
6. Wait > 60 seconds, return, click — you should see a background refresh (the indicator briefly flips).

---

## Code-change cheat sheet

| Change                                                    | Required? |
| --------------------------------------------------------- | --------- |
| Change `"Rendered from cache"` → `"Rendered from warm cache"` | ✅ yes (matches solution) |
| Tighten the panel JSX (remove `<div className="mt-2">` wrapper) | optional |
| Description className → `text-xs opacity-80`              | optional  |
| Delete `// TODO:` header                                  | ✅ yes    |

---

## Common mistakes

- **Adding a "Prefetch" button that calls `queryClient.fetchQuery`.** Forbidden by rule 2 — no manual warm-up path. Either the component renders (and fills cache) or a route loader fills it. Not both, and not a third manual button.
- **Defining `getBookOptions` inside the component.** It would still work, but defining it at module scope makes the "shared between component and loader" point obvious.
- **Setting `staleTime: 0`.** That undoes the whole warm-cache demo.
- **Wrapping `Exercise12` in `<Suspense>`.** Use the local boundary so the toggle button stays visible during cold load.
