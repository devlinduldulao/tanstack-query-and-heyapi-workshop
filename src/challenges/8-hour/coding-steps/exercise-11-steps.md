# Exercise 11 — Step-by-Step

> Goal: finish a "create book" form that uses the **generated mutation** for the network call and the **generated Zod schema** for the request shape, extended with UI-only rules. The form must refresh the same generated list after success, disable submit while in flight, and keep validation errors separate from network errors.

You are editing [`exercise-11.tsx`](../exercise-11.tsx). Reference: [`solutions/exercise-11-end.tsx`](../solutions/exercise-11-end.tsx).

Most of the file is correct. The single most important missing line is the actual `mutation.mutate(...)` call — without it the form validates but never submits. That is the first thing you fix.

---

## Mental model first

This form has three layers:

1. **Contract layer (generated, do not touch):** `postApiV1BooksMutation()` provides the typed mutation. `zBook` provides the runtime schema.
2. **UI rules layer (yours):** `createBookSchema = zBook.extend({...})` adds product-specific constraints — title ≥ 3 chars, page count positive.
3. **Component layer (yours):** form state, submit handler, disabled-while-pending button.

The key separation: **validation errors** (caught by `safeParse` _before_ the network call) and **network errors** (caught by the mutation's `onError`) live in two different places. Mixing them creates a state machine that is impossible to reason about.

---

## Step 1 — Read the TODO header

```tsx
// TODO:
// 1. Extend zBook with UI-level constraints.
// 2. Validate the form payload before mutation.mutate.
// 3. Keep validation errors separate from network errors.
// 4. Invalidate getApiV1BooksQueryKey() after a successful generated mutation.
```

Three of these (1, 3, 4) are already done. **Only #2 is the real missing edit.**

---

## Step 2 — Confirm `createBookSchema` extends `zBook`

```tsx
const createBookSchema = zBook.extend({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  pageCount: z.coerce.number().int().positive("Page count must be positive"),
});
```

Read it carefully:

- `zBook` is generated. `extend` keeps everything else and overrides only `title` and `pageCount`.
- `z.string().trim()` removes leading/trailing whitespace **before** `.min(3)` — so `"  ab "` is rejected, not accepted as 5 chars.
- `z.coerce.number()` turns the `<input>` string into a number. Without `.coerce`, `"120"` would fail `.int()`.
- `.positive()` rejects zero and negative numbers.

Nothing to change.

---

## Step 3 — Confirm the mutation block

```tsx
const mutation = useMutation({
  ...postApiV1BooksMutation(),
  onSuccess: () => {
    toast.success("Book created");
    void queryClient.invalidateQueries({ queryKey: getApiV1BooksQueryKey() });
  },
  onError: (error) => {
    toast.error(`Create failed: ${error.message}`);
  },
});
```

Two handlers, both required:

- `onSuccess` toasts and invalidates the same generated list key.
- `onError` toasts the server's message. This is the **network-error path**, separate from validation.

---

## Step 4 — Add the missing `mutation.mutate(...)` call

Find the submit handler:

```tsx
onSubmit={(e) => {
  e.preventDefault();
  setValidationError(null);

  const parsed = createBookSchema.safeParse({ /* ... */ });

  if (!parsed.success) {
    setValidationError(parsed.error.issues.map((issue) => issue.message).join(", "));
    return;
  }

  // TODO: call mutation.mutate({ body: parsed.data }) and clear the form on success.
}}
```

Replace the TODO line with:

```tsx
mutation.mutate({
  body: parsed.data,
});
setTitle("");
setPageCount("120");
```

**Why three lines:**

1. `mutation.mutate({ body: parsed.data })` — the network call. The arg shape `{ body: ... }` is dictated by the generated mutation type.
2. `setTitle("")` — clear the title. Done synchronously after kicking off the mutation; the form is ready for the next book.
3. `setPageCount("120")` — reset to the default the starter uses.

**Why clear here, not in `onSuccess`:** if you wait for `onSuccess`, the user can change inputs while the request is in flight, and you would overwrite their next-attempt typing. Clearing here is safe — the request is already on the wire.

**What if the request fails?** Form is cleared, `onError` shows the toast, user can re-type. If the requirement was "preserve form on failure", you would move the clear into `onSuccess` and accept the race. The solution made the choice you see above.

---

## Step 5 — Confirm "separate validation vs network errors"

After your edit, the error flow is:

- **Validation fail** → `setValidationError(...)` → `<p className="text-xs text-red-500">{validationError}</p>` renders below the inputs.
- **Network fail** → `toast.error(...)` → toast appears at the bottom-right.

Two surfaces, two state owners. Senior code review looks for exactly this separation.

---

## Step 6 — Tighten the form layout to match the solution

The starter returns the `<form>` directly and stacks the controls vertically. The solution wraps everything in a parent panel and turns the form into a responsive grid:

```tsx
return (
  <div className="max-w-sm space-y-3 text-sm">
    <form
      onSubmit={(e) => {
        // submit handler from Step 4
      }}
      className="grid gap-2 sm:grid-cols-[1fr_100px_auto]"
    >
      {/* inputs + button */}
    </form>
    {validationError && <p className="text-xs text-red-500">{validationError}</p>}
    {/* books list from Step 8 */}
  </div>
);
```

Make these small visual edits inside the form:

```tsx
<input className="flex-1 rounded border px-2 py-1" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
<input className="rounded border px-2 py-1" placeholder="Pages" value={pageCount} onChange={(e) => setPageCount(e.target.value)} />
<button type="submit" disabled={mutation.isPending} className="rounded border px-3 py-1 disabled:opacity-50">
  {mutation.isPending ? "…" : "Add"}
</button>
```

**Why this matters:** the mutation behavior is the main lesson, but the solution also demonstrates a compact form row and places the validation message outside the form. That keeps layout and form semantics cleaner.

---

## Step 7 — Confirm the disabled-while-pending button

```tsx
<button type="submit" disabled={mutation.isPending} className="rounded border px-3 py-1 disabled:opacity-50">
  {mutation.isPending ? "…" : "Add"}
</button>
```

`mutation.isPending` flips between `mutate(...)` and resolution. Disabling prevents double-submit. Already correct.

---

## Step 8 — Add the books list below the form

The solution reads the books list and renders the first 5 underneath:

```tsx
const { data: books } = useSuspenseQuery(getApiV1BooksOptions());
// ...
<ul className="space-y-1">
  {books?.slice(0, 5).map((b) => <li key={b.id}>{b.title}</li>)}
</ul>
```

**Why:** it visually proves invalidation worked. The moment `onSuccess` fires, this list re-renders with the new book. This is required if you want to match the reference solution.

If you add it, also:

1. Add `useSuspenseQuery` and `getApiV1BooksOptions` to your imports.
2. Wrap the return in a `<div>` (solution: `<div className="max-w-sm space-y-3 text-sm">`) so the form, validation error, and list sit inside it. The starter currently returns the `<form>` directly.

---

## Step 9 — Delete the `// TODO:` header

Remove the four-line block.

---

## Step 10 — Verify in the browser

1. Save.
2. Type a 2-character title → red validation message, **no** network request.
3. Type a valid title and positive page count → network request, success toast, form clears.
4. If you added the list, it refreshes with the new book.
5. Block `POST /api/v1/Books` in DevTools and submit → error toast, no validation message, form clears.

---

## Code-change cheat sheet

| Change                                                                                                  | Required? |
| ------------------------------------------------------------------------------------------------------- | --------- |
| Replace `// TODO: ...` with `mutation.mutate({ body: parsed.data })` + `setTitle("")` + `setPageCount("120")` | ✅ yes    |
| Move the form into `<div className="max-w-sm space-y-3 text-sm">` and use the grid form layout               | ✅ yes    |
| Add a books list below the form                                                                         | ✅ yes    |
| Delete `// TODO:` header                                                                                | ✅ yes    |
| Anywhere else                                                                                           | leave alone |

---

## Common mistakes

- **Flattening the mutation arg.** `mutation.mutate(parsed.data)` is wrong. Always `{ body: parsed.data }`.
- **Putting validation in `onError`.** Validation runs _before_ the network call.
- **Sharing one `error` state for both kinds of errors.** Keep them separate.
- **Forgetting `z.coerce.number()`.** Without it, page count would always fail `.int()` because it is a string.
