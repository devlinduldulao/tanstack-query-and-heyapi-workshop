# Exercise 9 — Step-by-Step

> Goal: build a list-plus-detail pattern using **two** generated query helpers, where the detail panel mounts only after a selection exists, and a manual refresh button invalidates the same generated list key.

You are editing [`exercise-9.tsx`](../exercise-9.tsx). Reference: [`solutions/exercise-9-end.tsx`](../solutions/exercise-9-end.tsx).

The starter has the full file scaffolded. Most of the code is correct. Your job is to make four small polish edits that elevate it from "works" to "production-ready".

---

## Mental model first

A list/detail screen always has two queries:

| Concern               | Helper                              | When it runs                          |
| --------------------- | ----------------------------------- | ------------------------------------- |
| The full list         | `getApiV1BooksOptions()`            | On mount, always                      |
| The selected item     | `getApiV1BooksByIdOptions({ path: { id } })` | **Only after** a row is clicked       |

"Only after" is enforced by `<Suspense>` + a conditional render. The shared invalidation handle is `getApiV1BooksQueryKey()` — the refresh button uses it, and any future mutation will use the same key.

---

## Step 1 — Read the TODO header and locate the four work areas

```tsx
// TODO:
// 1. Keep the generated getApiV1BooksByIdOptions for the detail panel.
// 2. Mount the detail query only when selectedId != null.
// 3. Use getApiV1BooksQueryKey() for the invalidation button.
// 4. Keep the list select small so components only receive the fields they render.
```

Items 1, 2, 3, and 4 are all already wired correctly. The real work is inside `SelectedBookPanel` plus a small `staleTime` tweak.

---

## Step 2 — Add a background-refresh indicator to `SelectedBookPanel`

Starter:

```tsx
function SelectedBookPanel({ selectedId }: { selectedId: number }) {
  const { data: book } = useSuspenseQuery(getApiV1BooksByIdOptions({ path: { id: selectedId } }));
  return (
    <div>
      <p className="font-medium">{book.title}</p>
      <p className="text-muted-foreground mt-1 text-xs">{book.description}</p>
    </div>
  );
}
```

Solution:

```tsx
function SelectedBookPanel({ selectedId }: { selectedId: number }) {
  const { data: book, isFetching } = useSuspenseQuery(getApiV1BooksByIdOptions({ path: { id: selectedId } }));
  return (
    <>
      <div className="mb-2 flex items-center gap-2">
        <h3 className="font-semibold">Selected book</h3>
        {isFetching && <span className="text-muted-foreground text-xs">Refreshing...</span>}
      </div>
      <p className="font-medium">{book.title}</p>
      <p className="text-muted-foreground mt-1 text-xs">{book.description}</p>
    </>
  );
}
```

**Three changes inside the panel:**

1. Destructure `isFetching`.
2. Move the "Selected book" heading **into** the panel so it can sit next to the indicator.
3. Use a fragment (`<>...</>`) instead of `<div>` — the parent `<section>` is the layout container.

**Why move the heading inside:** the indicator belongs to the panel's query. Heading + data live together so refactors do not separate them.

---

## Step 3 — Remove the duplicate `<h3>` from the parent `<section>`

Now that `SelectedBookPanel` renders its own heading, delete it from the parent:

Starter:

```tsx
<section className="border-l pl-4">
  <h3 className="mb-2 font-semibold">Selected book</h3>
  {!selectedId && <p className="text-muted-foreground">Select a book to run the generated detail query.</p>}
  {selectedId && (
    <Suspense fallback={<p className="text-muted-foreground">Loading selected book...</p>}>
      <SelectedBookPanel selectedId={selectedId} />
    </Suspense>
  )}
</section>
```

Solution:

```tsx
<section className="border-l pl-4">
  {selectedId && (
    <Suspense fallback={<p className="text-muted-foreground">Loading selected book...</p>}>
      <SelectedBookPanel selectedId={selectedId} />
    </Suspense>
  )}
</section>
```

Empty-state goes away — when nothing is selected, the right column simply renders nothing. The solution chose this minimalism.

---

## Step 4 — Tune the list `staleTime`

Find the list query:

```tsx
const { data: books = [] } = useSuspenseQuery({
  ...getApiV1BooksOptions(),
  staleTime: 0,
  select: ...
});
```

Change `staleTime: 0` → `staleTime: 60 * 1000`, and destructure `isFetching` so the button has visible feedback:

```tsx
const { data: books = [], isFetching } = useSuspenseQuery({
  ...getApiV1BooksOptions(),
  staleTime: 60 * 1000,
  select: ...
});
```

```tsx
{isFetching && <span className="text-muted-foreground text-xs">Refreshing...</span>}
```

**Why:** zero stale time means clicking the invalidate button is effectively the same as the automatic refetch on mount — there is no fresh window. With `60 * 1000`, the button actually means "I want fresher data than the 60-second window gives me".

The mock API always returns the same eight titles, so the list will not look different after a refetch. `isFetching` is how you prove the generated list key was hit. The detail panel's `isFetching` is a *different* query (`getApiV1BooksByIdOptions`) and will not flip when you invalidate the list.

---

## Step 5 — Choose a default selection (optional polish)

The solution starts with `useState<number | null>(1)`:

```tsx
const [selectedId, setSelectedId] = useState<number | null>(1);
```

**Why:** the detail panel mounts immediately on page open. The user sees what the panel does without clicking, and the `getApiV1BooksByIdOptions` query fires on first render to exercise the suspense boundary.

This is a UX choice, not a requirement. Pick `null` if you prefer empty-on-load.

---

## Step 6 — Add an active-row highlight (optional polish)

```tsx
<button
  onClick={() => setSelectedId(book.id)}
  className={`text-left hover:underline ${selectedId === book.id ? "font-semibold" : ""}`}
>
  {book.title}
</button>
```

**Why:** without this, the user has no idea which row drove the panel content. Three extra characters, huge UX win.

---

## Step 7 — Delete the `// TODO:` header

Remove the four-line block.

---

## Step 8 — Verify in the browser

1. Save.
2. Open Exercise 9.
3. With default `selectedId = 1`, the detail panel renders immediately.
4. Click a different book → the panel updates.
5. Click **Invalidate list** → **Refreshing...** appears next to the button, and DevTools → Network shows a fresh `GET /api/v1/Books`. The book titles will not change — `fakerestapi` always returns the same list. The point of the button is the targeted refetch of the generated list key, not new rows.

The detail panel's **Refreshing...** is a different query (`getApiV1BooksByIdOptions`). Invalidate list does **not** drive that label; picking another book does.

---

## Code-change cheat sheet

| Change                                              | Required? |
| --------------------------------------------------- | --------- |
| Destructure list `isFetching` next to **Invalidate list** | ✅ yes    |
| Destructure `isFetching` in `SelectedBookPanel`     | ✅ yes    |
| Move "Selected book" heading into the panel         | ✅ yes    |
| Use fragment instead of `<div>` in the panel        | ✅ yes    |
| Remove duplicate heading + empty-state from parent  | ✅ yes    |
| `staleTime: 0` → `60 * 1000` on the list query      | ✅ yes    |
| Default `selectedId` of `1`                         | optional  |
| Active-row highlight                                | optional  |
| Delete `// TODO:` header                            | ✅ yes    |

---

## Common mistakes

- **Adding `enabled: !!selectedId` to the detail query.** Not needed — the conditional render prevents the hook from mounting.
- **Wrapping `Exercise9` in `<Suspense>`.** Use a local boundary; the list lives under the route's Suspense boundary.
- **Calling `getApiV1BooksByIdOptions` at module scope.** It depends on `selectedId`, so it must be called inside the component each render.
