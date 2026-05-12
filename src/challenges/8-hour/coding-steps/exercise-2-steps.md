# Exercise 2 — Step-by-Step

> Goal: confirm the master-detail pattern is wired correctly with **two** generated read helpers — one for the list, one for the selected book — and that the detail panel mounts only after a selection.

You are editing [`exercise-2.tsx`](../exercise-2.tsx). Reference: [`solutions/exercise-2-end.tsx`](../solutions/exercise-2-end.tsx).

The starter is already functionally correct. This is a **code-review** exercise: read each piece, prove to yourself it meets the requirement, then delete the TODO header. Senior engineers do exactly this work on every pull request.

---

## Mental model first

A list/detail screen always has two queries:

| Concern              | Generated helper                                     | When it runs                            |
| -------------------- | ---------------------------------------------------- | --------------------------------------- |
| The full list        | `getApiV1BooksOptions()`                             | On mount, always                        |
| The selected record  | `getApiV1BooksByIdOptions({ path: { id } })`         | **Only after** a row is clicked         |

"Only after" is enforced by a conditional render + a local `<Suspense>`, **not** by `enabled: false`. The local boundary keeps the list visible while only the detail panel shows the spinner.

---

## Step 1 — Read the TODO header

```tsx
// TODO:
// 1. Start from getApiV1BooksOptions() and getApiV1BooksByIdOptions().
// 2. Mount the detail reader only when selectedId != null.
// 3. When user clicks a book in the list, set selectedId.
// 4. Render the selected book's title + description in the side panel.
```

All four are already satisfied in the starter. Your job is to verify, not rewrite.

---

## Step 2 — Confirm the `useBooks` wrapper

```tsx
function useBooks() {
  return useSuspenseQuery(getApiV1BooksOptions());
}
```

**Why a named hook instead of inlining `useSuspenseQuery(getApiV1BooksOptions())` in the component:** even at this size, naming the read makes the component body easier to scan. In bigger codebases you would put `useBooks` in a `hooks/` folder so other screens can reuse it. Here it lives in the same file — fine for the lab.

Nothing to change.

---

## Step 3 — Confirm `SelectedBookPanel`

```tsx
function SelectedBookPanel({ selectedId }: { selectedId: number }) {
  const { data: book } = useSuspenseQuery(getApiV1BooksByIdOptions({ path: { id: selectedId } }));
  return (
    <>
      <h3 className="mb-2 font-semibold">{book.title}</h3>
      <p className="text-xs opacity-80">{book.description}</p>
    </>
  );
}
```

Three things to verify:

1. **Path arg shape.** `{ path: { id: selectedId } }` is dictated by the generated type. Do not flatten to `getApiV1BooksByIdOptions(selectedId)` — TypeScript would warn you anyway.
2. **`selectedId: number` (not `number | null`).** This is the contract that the panel can only mount when a valid id exists. The parent enforces it with `selectedId && ...`.
3. **Fragment `<>` not `<div>`.** The parent `<aside>` already provides the box.

---

## Step 4 — Confirm the click sets state correctly

```tsx
<button
  onClick={() => setSelectedId(b.id ?? null)}
  className={`text-left hover:underline ${selectedId === b.id ? "font-semibold" : ""}`}
>
  {b.title}
</button>
```

- **`b.id ?? null`** — `Book.id` is optional in the generated type. The `??` fallback keeps the state type aligned (`number | null`).
- **Active-row highlight** — small UX win, already present.

---

## Step 5 — Confirm the conditional render + Suspense

```tsx
<aside className="border-l pl-4 opacity-70">
  {!selectedId && <p>Select a book to see its details...</p>}
  {selectedId && (
    <Suspense fallback={<p>Loading...</p>}>
      <SelectedBookPanel selectedId={selectedId} />
    </Suspense>
  )}
</aside>
```

- Empty-state when nothing is selected.
- Once selected, a **local** `<Suspense>` wraps the panel. If the detail fetch is slow, only this panel shows "Loading..." — the list never disappears.

This is the textbook list/detail pattern. Nothing to change.

---

## Step 6 — Optional polish to match the solution

The solution removes `opacity-70` from the `<aside>` so the detail text is full-opacity (the prompt text gets its own `opacity-70`):

```tsx
<aside className="border-l pl-4">
  {!selectedId && <p className="opacity-70">Select a book...</p>}
  {selectedId && (
    <Suspense fallback={<p>Loading...</p>}>
      <SelectedBookPanel selectedId={selectedId} />
    </Suspense>
  )}
</aside>
```

**Why:** book details should be readable at full contrast. Only the placeholder text is muted. This is purely cosmetic — adopt it to keep the diff clean against the solution.

---

## Step 7 — Delete the `// TODO:` header

Remove the four-line block once you have verified each bullet.

---

## Step 8 — Verify in the browser

1. Save.
2. Open Exercise 2.
3. List renders on the left.
4. Click a book → the right panel briefly shows "Loading..." then renders title + description.
5. Click a different book → only the panel re-suspends; the list stays visible.
6. DevTools → Network → confirm:
   - One `GET /api/v1/Books` on mount.
   - One `GET /api/v1/Books/{id}` per unique book selected; cached responses reuse the cache instead of refetching.

---

## Code-change cheat sheet

| Action                                                  | Required? |
| ------------------------------------------------------- | --------- |
| Delete `// TODO:` header                                | ✅ yes    |
| Remove `opacity-70` from `<aside>`, move it to the placeholder `<p>` | optional (matches solution) |
| Anywhere else                                           | leave alone |

---

## Common mistakes

- **Wrapping `Exercise2` in `<Suspense>`.** The list would disappear on every click. Use a **local** boundary around the detail only.
- **Adding `enabled: !!selectedId` to the detail query.** Not needed — the conditional render prevents the hook from mounting.
- **Calling `getApiV1BooksByIdOptions` at module scope.** It depends on `selectedId`; it must be called inside the component each render.
- **Flattening the path arg.** Always `{ path: { id } }`.
