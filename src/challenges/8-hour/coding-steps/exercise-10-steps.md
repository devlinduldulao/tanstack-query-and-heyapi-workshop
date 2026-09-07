# Exercise 10 — Step-by-Step

> Goal: prove the app shell pattern — feature components stay tiny because the **surrounding boundaries** own first-load and failure UI. You will add an `<ErrorBoundary>` and a `<Suspense>` around an existing `useSuspenseQuery`-driven list.

You are editing [`exercise-10.tsx`](../exercise-10.tsx). Reference: [`solutions/exercise-10-end.tsx`](../solutions/exercise-10-end.tsx).

This is one of the few 8-hour exercises with a **real structural change**. The data-rendering component stays the same; you wrap it in two boundaries.

---

## Mental model first

In the suspense-ready pattern, **three concerns separate cleanly**:

| Concern         | Owner                                         | UI                              |
| --------------- | --------------------------------------------- | ------------------------------- |
| First load      | A `<Suspense>` boundary                       | The `fallback` prop             |
| Failure         | An `<ErrorBoundary>`                          | The `fallback` prop             |
| Resolved data   | Your feature component (`BooksList`)          | Pure rendering of `data`        |

The big win: `BooksList` can _assume_ `data` is present. No `if (isLoading)`, no `if (error)`, no conditional rendering. The boundary owns those states once; every child component benefits.

`react-error-boundary` is already a project dependency (you can check `package.json` if you want).

---

## Step 1 — Read the existing component

```tsx
function BooksList() {
  const { data } = useSuspenseQuery(getApiV1BooksOptions());
  return (
    <ul className="space-y-1 text-sm">
      {data.slice(0, 5).map((b) => (
        <li key={b.id}>{b.title}</li>
      ))}
    </ul>
  );
}

export default function Exercise10() {
  return <BooksList />;
}
```

Notice what is **not** here:

- No `if (isLoading) return <Spinner />`.
- No `if (error) return <Error />`.
- No `data?.map(...)` with optional chaining.

That cleanliness is the goal. The cost: somebody must own the boundaries above this component. That somebody is `Exercise10` itself.

---

## Step 2 — Add the missing imports

At the top of the file, add:

```tsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
```

**Why two libraries:** React ships `<Suspense>` natively. Error boundaries in React must be class components — `react-error-boundary` provides a function-component-friendly wrapper. The project already depends on it; no install needed.

---

## Step 3 — Wrap `<BooksList />` with the two boundaries

Replace:

```tsx
export default function Exercise10() {
  return <BooksList />;
}
```

With:

```tsx
export default function Exercise10() {
  return (
    <ErrorBoundary fallback={<p className="text-red-500">Failed to load.</p>}>
      <Suspense
        fallback={
          <ul className="space-y-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index}>
                <Skeleton className="h-4 w-56" />
              </li>
            ))}
          </ul>
        }
      >
        <BooksList />
      </Suspense>
    </ErrorBoundary>
  );
}
```

**Why this exact nesting (ErrorBoundary outside, Suspense inside):**

If `<Suspense>` is the outer one and the query throws an error, the error would bubble _past_ the suspense boundary and not be caught at the right level. The convention is:

```
<ErrorBoundary>
  <Suspense>
    {/* hooks that may suspend or throw */}
  </Suspense>
</ErrorBoundary>
```

Read aloud as: "If anything in here throws, ErrorBoundary catches it. While anything in here suspends, Suspense shows a fallback."

**Why the order matters in practice:** TanStack Query's `useSuspenseQuery` throws a Promise (to suspend) on first load, and throws an Error if the query function rejects. The Promise is caught by `<Suspense>`. The Error needs `<ErrorBoundary>`. Putting ErrorBoundary _outside_ ensures it catches errors even after the suspense fallback has been shown and replaced.

---

## Step 4 — Inspect what the boundaries actually do

After your edit, the request lifecycle looks like:

1. **First render, cache cold** → `useSuspenseQuery` throws a Promise → `<Suspense>` catches it and renders the skeleton rows in `fallback`.
2. **Request resolves** → Suspense unmounts the fallback and renders `<BooksList />` with data.
3. **Request rejects** → `useSuspenseQuery` throws an Error → `<ErrorBoundary>` catches it and shows `"Failed to load."`.
4. **Component re-mounts with warm cache** → no suspense at all; `data` is immediately available.

That entire state machine is now declared by **structure** instead of `if/else`. That is the suspense-ready pattern.

---

## Step 5 — (Optional) Add a retry affordance

The instructions hint at "an error fallback with a retry affordance". The solution keeps it minimal with just a paragraph. To add retry, use `react-error-boundary`'s `FallbackComponent` prop:

```tsx
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

function Fallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="text-red-500">
      <p>Failed to load.</p>
      <button onClick={resetErrorBoundary} className="mt-2 rounded border px-2 py-1 text-xs">
        Retry
      </button>
    </div>
  );
}

export default function Exercise10() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Suspense
        fallback={
          <ul className="space-y-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index}>
                <Skeleton className="h-4 w-56" />
              </li>
            ))}
          </ul>
        }
      >
        <BooksList />
      </Suspense>
    </ErrorBoundary>
  );
}
```

`resetErrorBoundary()` unmounts the boundary and remounts the children, which re-runs the query. Optional, but a great real-world habit.

---

## Step 6 — Verify in the browser

1. Save.
2. Open Exercise 10.
3. First load → you may briefly see the skeleton rows then the book list.
4. To verify the error path: DevTools → Network → block `GET /api/v1/Books`, then reload. You should see "Failed to load.".
5. Unblock → reload → the list returns.

---

## Code-change cheat sheet

| Change                                                         | Required? |
| -------------------------------------------------------------- | --------- |
| `import { Suspense } from "react"`                             | ✅ yes    |
| `import { ErrorBoundary } from "react-error-boundary"`         | ✅ yes    |
| Replace `<BooksList />` with `<ErrorBoundary><Suspense><BooksList /></Suspense></ErrorBoundary>` | ✅ yes |
| Add a `FallbackComponent` with a Retry button                  | optional  |

---

## Common mistakes

- **Suspense outside, ErrorBoundary inside.** Wrong order — errors after the initial suspense will not be caught at the expected level.
- **Putting `try/catch` inside `BooksList` to "be safe".** `useSuspenseQuery` _wants_ to throw. Catching it breaks the pattern.
- **Using `useQuery` to control your own loading states.** Defeats the suspense-ready architecture. Use `useSuspenseQuery` and let boundaries own loading + error.
- **One global ErrorBoundary at the app root.** That works as a safety net but is too broad. A localized boundary lets one section fail without taking the whole page down.
