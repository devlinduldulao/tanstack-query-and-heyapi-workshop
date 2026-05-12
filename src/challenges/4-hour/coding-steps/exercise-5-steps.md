# Exercise 5 — Step-by-Step

> Goal: finish a "create book" form that uses the **generated mutation** for the network call and the **generated Zod schema** for the request shape, extended with UI-only rules. The form must refresh the same generated list after success, disable submit while in flight, and keep validation errors separate from network errors.

You are editing [`exercise-5.tsx`](../exercise-5.tsx). The reference output is [`solutions/exercise-5-end.tsx`](../solutions/exercise-5-end.tsx).

Most of the file is already correct. The single most important missing line is the actual `mutation.mutate(...)` call — without it, your form validates but never submits. That is the first thing you fix.

---

## Mental model first

This form has three layers:

1. **Contract layer (generated, do not touch):** `postApiV1BooksMutation()` provides the typed mutation. `zBook` provides the runtime schema.
2. **UI rules layer (yours):** `createBookSchema = zBook.extend({...})` adds the product-specific constraints — title ≥ 3 chars, page count positive.
3. **Component layer (yours):** the form state, the submit handler, the disabled-while-pending button.

The key separation is between **validation errors** (caught by `safeParse` _before_ the network call) and **network errors** (caught by the mutation's `onError`). Mixing them into one error variable creates a state machine that is impossible to reason about — keep them in two different places.

---

## Step 1 — Read the TODO header

```tsx
// TODO:
// 1. Extend zBook with UI-level constraints.
// 2. Validate the form payload before mutation.mutate.
// 3. Keep validation errors separate from network errors.
// 4. Invalidate getApiV1BooksQueryKey() after a successful generated mutation.
```

Three of these (1, 3, 4) are already done in the starter. **Only #2 is the real missing edit.**

---

## Step 2 — Confirm `createBookSchema` extends `zBook`

```tsx
const createBookSchema = zBook.extend({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  pageCount: z.coerce.number().int().positive("Page count must be positive"),
});
```

Read this carefully — there is a lot going on:

- `zBook` is generated and reflects the backend's required fields. `extend` keeps everything else as-is and overrides only `title` and `pageCount`.
- `z.string().trim()` removes leading/trailing whitespace **before** the `.min(3)` check — so `"  ab "` is rejected, not accepted as 5 characters.
- `z.coerce.number()` turns the `<input>` string into a number. Without `.coerce`, the value `"120"` would fail `.int()` because it is still a string.
- `.positive()` rejects both zero and negative numbers.

**Why this matters:** these are UI rules. The backend probably also rejects bad data — but waiting for a 400 response to find out is slow and produces a worse error message. Validating client-side gives the user a message the moment they tab out of the field.

You do **not** need to change this block. Confirm it is correct.

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

- `onSuccess` toasts and invalidates the same generated list key. The books-list query, wherever it is consumed, will refetch automatically.
- `onError` toasts the server's error message. This is the **network-error path**.

Notice that `onError` is _not_ involved in form validation — that is handled separately in Step 4 below. This separation is the third TODO item.

---

## Step 4 — Add the missing `mutation.mutate(...)` call

This is the only real code edit. Find the submit handler:

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

**Why three lines instead of one:**

1. `mutation.mutate({ body: parsed.data })` — the actual network call. The argument shape `{ body: ... }` is dictated by the generated mutation type; do not flatten it.
2. `setTitle("")` — clear the title field. Done synchronously _after_ kicking off the mutation, because `mutate` is fire-and-forget and we want the form ready for the next book.
3. `setPageCount("120")` — reset to the default. (The starter uses `"120"` as the initial value; keep that consistent.)

**Why clear the form here and not in `onSuccess`:** if you wait for `onSuccess` to clear the form, the user can change the inputs while the request is in flight, and you would overwrite their next-attempt typing. Clearing here (synchronously after `mutate`) is safe because the request is already on the wire.

**What if the request fails?** The form is cleared, but `onError` shows a toast and the optimistic clear is fine — the user can re-type. If the requirement was "preserve form on failure", you would move the clear into `onSuccess` and accept the race. Either choice is defensible; the solution made the choice you see above.

---

## Step 5 — Confirm "separate validation vs network errors"

After your edit, the error flow is:

- **Validation fail** → `setValidationError(...)` → `<p className="text-xs text-red-500">{validationError}</p>` renders below the inputs.
- **Network fail** → `toast.error(...)` → toast appears at the bottom-right.

Two different surfaces, two different state owners. Senior code review will look for exactly this separation.

---

## Step 6 — Verify the submit button is disabled while pending

```tsx
<button type="submit" disabled={mutation.isPending} className="rounded border px-3 py-1 disabled:opacity-50">
  {mutation.isPending ? "Saving…" : "Add book with generated mutation"}
</button>
```

`mutation.isPending` flips to `true` between `mutate(...)` being called and the request resolving. Disabling the button during this window prevents the double-submit problem. Already correct in the starter — confirm and move on.

---

## Step 7 — (Optional) Add a books list under the form

The **solution** also reads the books list and renders the first 5 underneath the form:

```tsx
const { data: books } = useSuspenseQuery(getApiV1BooksOptions());
// ...
<ul className="space-y-1">
  {books?.slice(0, 5).map((b) => <li key={b.id}>{b.title}</li>)}
</ul>
```

**Why this is in the solution:** it visually proves the invalidation worked. The moment the mutation's `onSuccess` fires, this list re-renders with the new book. Without the list, you can only verify success through the toast.

This is optional but recommended — it is the live demo of why generated keys matter.

If you add it, you also need to:

1. Add `useSuspenseQuery` and `getApiV1BooksOptions` to your imports.
2. Wrap the return in a `<div>` (the solution uses `<div className="max-w-sm space-y-3 text-sm">`) and put the form, the validation error, and the list inside it. The starter currently returns the `<form>` directly — you have to widen the wrapper to include the list.

---

## Step 8 — Delete the `// TODO:` header

Once `mutation.mutate(...)` is in place, delete the four-line TODO at the top.

---

## Step 9 — Verify in the browser

1. Save.
2. Type a 2-character title and click submit → red validation message appears, **no** network request.
3. Type a valid title (≥ 3 chars) and a positive page count → network request happens, success toast, form clears.
4. (If you added the list) The list refreshes with the new book at the top.
5. Simulate a failure — DevTools → Network → block `POST /api/v1/Books` and submit again. You should see the error toast, **no** validation message, and the form clears (per the choice in Step 4).

---

## Code-change cheat sheet

| Change                                          | Required? | Why                                                  |
| ----------------------------------------------- | --------- | ---------------------------------------------------- |
| Replace `// TODO: call mutation.mutate(...)` with `mutation.mutate({ body: parsed.data })` + `setTitle("")` + `setPageCount("120")` | ✅ yes | Actually submit and reset for next entry             |
| Add a books list below the form                 | optional  | Live proof that invalidation re-renders consumers    |
| Delete `// TODO:` header                        | ✅ yes    | Acceptance complete                                  |
| Anywhere else                                   | **leave alone** | Schema, mutation handlers, and validation are correct |

---

## Common mistakes

- **Flattening the mutation arg.** `mutation.mutate(parsed.data)` is wrong — the generated mutation expects `{ body: parsed.data }`.
- **Putting validation in `onError`.** Validation runs _before_ the network call. `onError` only handles request failures.
- **Sharing a single `error` state for both kinds of errors.** Read the React docs on "one state, one source of change" — your future self will thank you for the separation.
- **Forgetting `z.coerce.number()`.** Without it, the page-count input would always fail `.int()` because it is a string.
