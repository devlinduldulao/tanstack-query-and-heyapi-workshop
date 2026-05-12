# Challenge 1: Author Manager (CRUD) — Step-by-Step

> Goal: build a complete **Author Manager** with Create, Read, Update, and Delete — all powered by generated Hey API helpers, with success/error toasts and one shared generated query key driving every refresh.

You are editing [`challenge-1-feature.tsx`](../challenge-1-feature.tsx). Reference: [`solutions/challenge-1-feature-end.tsx`](../solutions/challenge-1-feature-end.tsx).

Unlike the regular exercises, the starter here gives you only a **read** of the authors list. Everything else is yours to build. This is the day-2 capstone — you will combine every pattern from Exercises 4, 5, 6, and 11 into one screen.

---

## Mental model first: the CRUD recipe

For each operation you wire **three things**:

| Operation | Generated helper(s)                            | Side effect on success                                        |
| --------- | ---------------------------------------------- | ------------------------------------------------------------- |
| Read      | `getApiV1AuthorsOptions()` + `useSuspenseQuery` | — (renders the data)                                          |
| Create    | `postApiV1AuthorsMutation()`                   | toast.success + invalidate `getApiV1AuthorsQueryKey()`        |
| Update    | `putApiV1AuthorsByIdMutation()`                | toast.success + invalidate + close the inline editor          |
| Delete    | `deleteApiV1AuthorsByIdMutation()`             | toast.success + invalidate                                    |
| All       | `onError`                                      | toast.error with the server message                           |

The **single most important rule:** every mutation invalidates the same generated `getApiV1AuthorsQueryKey()`. That single key holds the entire screen together.

---

## Step 1 — Read the starter

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1AuthorsOptions } from "@/api/client/@tanstack/react-query.gen";

export default function Challenge1Feature() {
  const { data } = useSuspenseQuery(getApiV1AuthorsOptions());

  return (
    <div className="text-sm">
      <h3 className="mb-3 font-semibold">Authors</h3>
      <ul className="max-h-64 space-y-1 overflow-auto">
        {data?.slice(0, 10).map((a) => (
          <li key={a.id}>{a.firstName} {a.lastName}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs opacity-70">TODO: Add create / edit / delete with success and error toasts.</p>
    </div>
  );
}
```

You have:

- `useSuspenseQuery` reading the authors list.
- A list renderer.
- A TODO note that announces what is missing.

Plan the work top-down:

1. Expand imports.
2. Wire `useQueryClient` + `queryKey`.
3. Define the three mutations (create, update, delete) — each follows the same skeleton.
4. Add form state for the create flow.
5. Add edit state for the update flow (track `editingId`, `editFirst`, `editLast`).
6. Render the create form above the list.
7. For each row, render either edit-mode or display-mode depending on `editingId`.
8. Delete the TODO note.

Do not try to write all of this at once. **Build one mutation at a time and verify it before moving on.**

---

## Step 2 — Expand the imports

```tsx
import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteApiV1AuthorsByIdMutation,
  getApiV1AuthorsOptions,
  getApiV1AuthorsQueryKey,
  postApiV1AuthorsMutation,
  putApiV1AuthorsByIdMutation,
} from "@/api/client/@tanstack/react-query.gen";
```

**Why all of these:**

- `useState` for form/edit fields.
- `useMutation` for the three write operations.
- `useQueryClient` so we can call `invalidateQueries`.
- `toast` for feedback.
- The four generated helpers for the four CRUD operations + the query key.

---

## Step 3 — Add the cache plumbing

Inside the component:

```tsx
const queryClient = useQueryClient();
const queryKey = getApiV1AuthorsQueryKey();
const { data: authors } = useSuspenseQuery(getApiV1AuthorsOptions());
```

The same `queryKey` variable will be used by all three mutations.

---

## Step 4 — Define the three mutations (one at a time)

Define **create first** because the form is simplest:

```tsx
const create = useMutation({
  ...postApiV1AuthorsMutation(),
  onSuccess: () => {
    toast.success("Author created");
    void queryClient.invalidateQueries({ queryKey });
  },
  onError: (error) => {
    toast.error(`Create failed: ${error.message}`);
  },
});
```

**Then update:**

```tsx
const update = useMutation({
  ...putApiV1AuthorsByIdMutation(),
  onSuccess: () => {
    toast.success("Author updated");
    void queryClient.invalidateQueries({ queryKey });
  },
  onError: (error) => {
    toast.error(`Update failed: ${error.message}`);
  },
});
```

**Then delete:**

```tsx
const remove = useMutation({
  ...deleteApiV1AuthorsByIdMutation(),
  onSuccess: () => {
    toast.success("Author deleted");
    void queryClient.invalidateQueries({ queryKey });
  },
  onError: (error) => {
    toast.error(`Delete failed: ${error.message}`);
  },
});
```

**Why all three follow the same shape:** consistency. Code review can scan them in seconds. Refactoring to extract a helper is tempting but premature — there are exactly three. Keep them flat.

**Why the variable name is `remove`, not `delete`:** `delete` is a reserved word in JavaScript.

---

## Step 5 — Add the form state

```tsx
const [first, setFirst] = useState("");
const [last, setLast] = useState("");
const [editingId, setEditingId] = useState<number | null>(null);
const [editFirst, setEditFirst] = useState("");
const [editLast, setEditLast] = useState("");
```

**Why separate create/edit state:** the user might be typing in the create form _and_ have an edit form open. They must not interfere.

**Why `editingId` is the source of truth:** rendering "this row is in edit mode" is a function of `editingId === a.id`. One state variable, easy to reason about.

---

## Step 6 — Build the create form

Render it above the list:

```tsx
<form
  onSubmit={(e) => {
    e.preventDefault();
    if (!first && !last) return;
    create.mutate({
      body: { id: 0, idBook: 1, firstName: first, lastName: last },
    });
    setFirst("");
    setLast("");
  }}
  className="flex gap-2"
>
  <input className="flex-1 rounded border px-2 py-1" placeholder="First" value={first} onChange={(e) => setFirst(e.target.value)} />
  <input className="flex-1 rounded border px-2 py-1" placeholder="Last" value={last} onChange={(e) => setLast(e.target.value)} />
  <button type="submit" disabled={create.isPending} className="rounded border px-3 py-1 disabled:opacity-50">
    Add
  </button>
</form>
```

**Walkthrough:**

- **`if (!first && !last) return`** — refuses to submit when both fields are empty. (Real validation could be stricter; the lab keeps it pragmatic.)
- **`body: { id: 0, idBook: 1, firstName, lastName }`** — the generated `Author` type requires `id` and `idBook`. We send `0` and `1` as placeholders; the fake API accepts them.
- **Clear inputs after submit** — same pattern as Exercise 11. Fire-and-forget; if it fails, `onError` shows the toast.
- **`disabled={create.isPending}`** — prevents double-submit.

Save and verify create works before moving on.

---

## Step 7 — Build the list with edit + delete

Replace the existing `<ul>` with:

```tsx
<ul className="max-h-72 space-y-1 overflow-auto">
  {authors?.slice(0, 10).map((a) => (
    <li key={a.id} className="flex items-center justify-between gap-2 border-b py-1">
      {editingId === a.id ? (
        <EditRow author={a} /* see Step 8 */ />
      ) : (
        <DisplayRow author={a} /* see Step 9 */ />
      )}
    </li>
  ))}
</ul>
```

Conceptually that is the shape. In practice the solution inlines both rows for brevity. We will do the same below.

---

## Step 8 — The edit-mode row (inline)

```tsx
{editingId === a.id ? (
  <>
    <input
      className="flex-1 rounded border px-2 py-0.5"
      value={editFirst}
      onChange={(e) => setEditFirst(e.target.value)}
    />
    <input
      className="flex-1 rounded border px-2 py-0.5"
      value={editLast}
      onChange={(e) => setEditLast(e.target.value)}
    />
    <button
      className="rounded border px-2 py-0.5 text-xs"
      disabled={update.isPending}
      onClick={() => {
        update.mutate(
          {
            path: { id: a.id! },
            body: { id: a.id!, idBook: a.idBook!, firstName: editFirst, lastName: editLast },
          },
          {
            onSuccess: () => {
              setEditingId(null);
            },
          },
        );
      }}
    >
      Save
    </button>
    <button className="text-xs opacity-60" onClick={() => setEditingId(null)}>
      ×
    </button>
  </>
) : ( /* display row, Step 9 */ )}
```

**Notice three patterns:**

1. **`update.mutate({ path, body }, { onSuccess: () => setEditingId(null) })`** — this is a **per-call** `onSuccess` _in addition to_ the mutation-level `onSuccess`. Both fire. The per-call one closes the editor; the mutation-level one toasts and invalidates. Keeping them separate avoids passing `editingId` into the mutation definition.
2. **`a.id!` and `a.idBook!`** — non-null assertions on optional fields. In practice the server always returns them; we accept that risk in this lab.
3. **The `×` cancel button** sets `editingId` to `null` _without_ calling the mutation. Cancel must be cheap.

---

## Step 9 — The display-mode row (inline)

```tsx
) : (
  <>
    <span className="flex-1">{a.firstName} {a.lastName}</span>
    <button
      className="text-xs opacity-70"
      onClick={() => {
        setEditingId(a.id!);
        setEditFirst(a.firstName ?? "");
        setEditLast(a.lastName ?? "");
      }}
    >
      edit
    </button>
    <button
      className="text-xs text-red-500"
      disabled={remove.isPending}
      onClick={() => remove.mutate({ path: { id: a.id! } })}
    >
      delete
    </button>
  </>
)}
```

**Notice:**

- **`onClick` for edit prefills the edit state.** Without this, the edit inputs start empty even though the row has data.
- **`?? ""` on the prefills** — `firstName`/`lastName` are optional in the generated type.
- **Delete is fire-and-forget.** No confirmation prompt — the lab keeps it pragmatic. In production you would add a confirm dialog.

---

## Step 10 — Remove the TODO note

Delete the `<p className="mt-3 text-xs opacity-70">TODO: ...</p>` placeholder.

---

## Step 11 — Verify the full CRUD loop

1. Save.
2. Open Challenge 1.
3. **Create**: type a first + last name, click Add → success toast, list refreshes with the new author near the top.
4. **Update**: click "edit" on a row → inputs prefill → change last name → click Save → success toast, row reverts to display mode, list refreshes.
5. **Cancel**: open edit, click `×` → no network request, row reverts.
6. **Delete**: click "delete" on a row → success toast, row disappears.
7. **Failure path**: in DevTools, block `DELETE /api/v1/Authors/...`, then click delete → error toast.
8. DevTools → Network sanity check for each operation: one write request followed by one `GET /api/v1/Authors`.

---

## Step 12 — Final polish (optional)

- **Disable Save when both edit inputs are empty.** Simple guard.
- **Show "Saving…" / "Deleting…" on the buttons** when their mutation is pending — same idiom as the Add button.
- **Confirm-on-delete** with `window.confirm("Delete?")` for safety.

None of these are required, but each is a real-world habit worth practicing.

---

## Code-change cheat sheet (in build order)

| # | Action                                                                |
| - | --------------------------------------------------------------------- |
| 1 | Expand imports (state, mutation hooks, generated helpers, toast)      |
| 2 | Add `useQueryClient` + `queryKey` + read query                        |
| 3 | Define `create` mutation                                              |
| 4 | Build the create `<form>` above the list                              |
| 5 | Verify create works                                                   |
| 6 | Define `remove` mutation                                              |
| 7 | Add delete button to each row                                         |
| 8 | Verify delete works                                                   |
| 9 | Add `editingId` / `editFirst` / `editLast` state                       |
| 10 | Define `update` mutation                                              |
| 11 | Add edit/display conditional inside the `<li>`                        |
| 12 | Wire Save (mutate with per-call `onSuccess`) and × cancel             |
| 13 | Verify update works                                                   |
| 14 | Delete the TODO note                                                  |

**Build → verify → next.** Do not try to write everything before clicking. The whole point of generated contracts is fast feedback — use it.

---

## Common mistakes

- **One mutation handling all three operations.** They have different generated helpers and different request shapes. Use three `useMutation`s.
- **Inventing a query key.** Always `getApiV1AuthorsQueryKey()`.
- **Closing the editor in the mutation's top-level `onSuccess`.** That would also close the editor when a _different_ row is being saved (or worse, when create completes). Use the per-call `onSuccess` argument to `mutate(...)`.
- **Forgetting the `idBook` field in create/update.** TypeScript will tell you.
- **Putting validation in `onError`.** Validation lives before `mutate`. `onError` is for network failures.
- **Calling `delete` instead of `remove` for the mutation variable.** Reserved word.
