# Exercise 4 — Step-by-Step

> Goal: build a list-plus-detail pattern using **two** generated query helpers, where the detail panel mounts only after a selection exists, and a manual refresh button invalidates the same generated list key.

You are editing [`exercise-4.tsx`](../exercise-4.tsx). The reference output is [`solutions/exercise-4-end.tsx`](../solutions/exercise-4-end.tsx).

The starter already has the full file scaffolded. Most of the visible code is correct. Your job is to make four small polish edits that elevate it from "works" to "production-ready".

---

## Mental model first

A list/detail screen always has two queries:

| Concern               | Helper                              | When it runs                          |
| --------------------- | ----------------------------------- | ------------------------------------- |
| The full list         | `getApiV1BooksOptions()`            | On mount, always                      |
| The currently selected item | `getApiV1BooksByIdOptions({ path: { id } })` | **Only after** a row is clicked       |

The "only after" rule is enforced by `<Suspense>` + a conditional render, _not_ by checking `enabled: false`. That keeps the suspense boundary local to the panel — the list is never stuck waiting on the detail.

The shared invalidation handle is `getApiV1BooksQueryKey()`. The refresh button uses it, and any future mutation will use it too.

---

## Step 1 — Read the TODO header and locate the four work areas

Open [`exercise-4.tsx`](../exercise-4.tsx). The top says:

```tsx
// TODO:
// 1. Keep the generated getApiV1BooksByIdOptions for the detail panel.
// 2. Mount the detail query only when selectedId != null.
// 3. Use getApiV1BooksQueryKey() for the invalidation button.
// 4. Keep the list select small so components only receive the fields they render.
```

The four work areas live in four different parts of the file:

1. `SelectedBookPanel` — the detail panel.
2. The JSX condition `{selectedId && (<Suspense ...>)}` — already correct.
3. The "Invalidate list" button — already correct.
4. The list `select` — already correct.

So the actual edits you need are **inside `SelectedBookPanel`** and a small `staleTime` tweak. Let's go through them in order of impact.

---

## Step 2 — Add a background-refresh indicator to `SelectedBookPanel`

The starter version of the panel is:

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

It renders, but the user has no idea when a background refetch is happening. Compare with the solution:

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

1. Destructure `isFetching` from the query result.
2. Move the "Selected book" heading **into** the panel (so it can sit next to the indicator).
3. Wrap the JSX in a fragment (`<>...</>`) instead of a `<div>`, because the parent `<section>` is now the layout container.

**Why move the heading into the panel:** the heading needs to live next to the `isFetching` flag. The flag belongs to the panel's query — so the heading belongs there too. This is a small "data and label live together" refactor.

---

## Step 3 — Remove the duplicate `<h3>` from the parent `<section>`

Now that `SelectedBookPanel` renders its own "Selected book" heading, delete the original one from the right-hand `<section>`:

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

Change to:

```tsx
<section className="border-l pl-4">
  {selectedId && (
    <Suspense fallback={<p className="text-muted-foreground">Loading selected book...</p>}>
      <SelectedBookPanel selectedId={selectedId} />
    </Suspense>
  )}
</section>
```

The empty-state message also goes away — when nothing is selected, the right column simply renders nothing. The solution chose that minimalism; you can keep the empty-state if you prefer, but match the solution to keep the diff clean.

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

Change `staleTime: 0` to `staleTime: 60 * 1000`.

**Why:** zero stale time means clicking the invalidate button is effectively the same as the automatic refetch on mount — there is no fresh window. With `60 * 1000` the button actually means something: "I want fresher data than the 60-second window gives me by default".

---

## Step 5 — Choose a default selection (optional polish)

The solution starts with `useState<number | null>(1)` instead of `null`:

```tsx
const [selectedId, setSelectedId] = useState<number | null>(1);
```

**Why:** the detail panel mounts immediately on page open, so the user can _see_ what the panel does without having to click. It also exercises the `getApiV1BooksByIdOptions` query on first render — useful when you want to confirm the suspense boundary works.

This is a UX choice, not a requirement. Pick `null` if you prefer the empty-on-load look.

---

## Step 6 — Add an active-row highlight (optional polish)

The solution adds a conditional className to highlight the selected book:

```tsx
<button
  onClick={() => setSelectedId(book.id)}
  className={`text-left hover:underline ${selectedId === book.id ? "font-semibold" : ""}`}
>
  {book.title}
</button>
```

**Why:** without this, the user has no idea which row drove the panel content. It's three extra characters but a huge UX win.

---

## Step 7 — Confirm the imports

Compare the starter imports with the solution. The starter has an extra `import type { Book } from "@/api/client";` line that the solution does not need because the inferred type from `select` is sufficient.

If you want a clean diff, remove the unused `Book` import. If TypeScript complains it is unused, ESLint or the unused-import rule will tell you anyway. (Not a hard requirement.)

---

## Step 8 — Delete the `// TODO:` header

All four requirements are satisfied. Remove the header.

---

## Step 9 — Verify in the browser

1. Save.
2. Open Exercise 4 in the bootcamp UI.
3. With the default `selectedId = 1`, the detail panel should render immediately.
4. Click a different book — the panel should update.
5. Click "Invalidate list" — Network tab shows a fresh `GET /api/v1/Books`, and the panel briefly shows "Refreshing..." if a background refetch is happening.

---

## Code-change cheat sheet

| Change                                              | Required? | Why                                              |
| --------------------------------------------------- | --------- | ------------------------------------------------ |
| Destructure `isFetching` in `SelectedBookPanel`     | ✅ yes    | Visible background-refresh feedback              |
| Move "Selected book" heading into the panel         | ✅ yes    | Heading lives with its data                      |
| Use fragment instead of `<div>` in the panel        | ✅ yes    | Parent `<section>` already provides the box      |
| Remove duplicate heading + empty-state from parent  | ✅ yes    | No duplication                                   |
| `staleTime: 0` → `60 * 1000` on the list query      | ✅ yes    | Make invalidation meaningful                     |
| Default `selectedId` of `1`                         | optional  | First-load UX                                    |
| Active-row highlight                                | optional  | UX                                               |
| Remove unused `Book` import                         | optional  | Clean diff                                       |
| Delete `// TODO:` header                            | ✅ yes    | Acceptance complete                              |

---

## Common mistakes

- **Adding `enabled: !!selectedId` to the detail query.** Not needed and not in the solution. The conditional render in the parent already prevents the hook from mounting.
- **Wrapping the whole `Exercise4` in `<Suspense>`.** No — only the detail panel needs a local boundary. The list lives under the route's Suspense boundary.
- **Calling `getApiV1BooksByIdOptions` at module scope.** It is a hook-input builder, not a hook itself, but it depends on `selectedId`, so it must be called inside the component each render.
