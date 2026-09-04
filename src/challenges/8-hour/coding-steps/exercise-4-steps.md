# Exercise 4 — Step-by-Step

> Goal: submit a new book through the **generated** `postApiV1BooksMutation` helper, showing success and failure feedback through toasts, with the submit button disabled while the request is in flight.

You are editing [`exercise-4.tsx`](../exercise-4.tsx). Reference: [`solutions/exercise-4-end.tsx`](../solutions/exercise-4-end.tsx).

The starter has the form and a generated `useMutation` **without** `mutate`, toasts, or success/error handlers. Submitting the form currently does nothing. Your job is to call `mutation.mutate`, disable the button while pending, and toast the outcome. **Show Solution** should then create a book.

---

## Mental model first

A generated mutation has three layers:

1. **Contract (generated, do not touch):** `postApiV1BooksMutation()` returns `{ mutationFn, ... }` typed against the OpenAPI spec.
2. **Cache integration:** `useMutation({ ...postApiV1BooksMutation(), onSuccess, onError })` wires it to TanStack Query and gives you `mutation.mutate`, `mutation.isPending`, etc.
3. **UI:** the form fields, the submit handler, the disabled state, and the toast surfaces.

The "trick" is that the request body must match the generated `Book` shape — `id`, `title`, `description`, `pageCount`, `excerpt`, `publishDate`. The fake API accepts whatever, but the contract is what TypeScript checks.

---

## Step 1 — Read the TODO header

```tsx
// TODO:
// 1. Wrap the form submit in useMutation.
// 2. Use the generated postApiV1BooksMutation helper.
// 3. Disable submit while isPending; show success / error states.
```

The mutation helper is imported. You still need toasts and `mutate`.

---

## Step 2 — Add success and error toasts

```tsx
import { toast } from "sonner";

const mutation = useMutation({
  ...postApiV1BooksMutation(),
  onSuccess: () => {
    toast.success("Book created");
  },
  onError: (error) => {
    toast.error(`Create failed: ${error.message}`);
  },
});
```

Two handlers, both required:

- `onSuccess` toasts success.
- `onError` toasts the server's error message.

**Notice what is _not_ here:** no invalidation. That is _intentionally_ deferred to Exercise 5, where the lesson is specifically about reconnecting writes to the read. For Exercise 4, the lesson is the mutation mechanics alone.

---

## Step 3 — Call `mutation.mutate` on submit

The starter's `handleSubmit` only calls `preventDefault`. Replace it with the generated body shape, inlined on the form to match the solution:

```tsx
return (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      mutation.mutate({
        body: {
          id: 0,
          title: form.title,
          description: form.description,
          pageCount: 1,
          excerpt: form.description,
          publishDate: new Date().toISOString(),
        },
      });
    }}
    className="..."
  >
```

**Why inline:**

- The handler is only used once — no need for a named function.
- It's not really `async`. `mutation.mutate` is fire-and-forget; nothing inside the handler `await`s. Marking it `async` is misleading.
- The `// TODO:` comment goes away with it.

Both versions work. Match the solution to keep the diff clean.

---

## Step 4 — Confirm the request body matches the generated shape

```tsx
{
  id: 0,
  title: form.title,
  description: form.description,
  pageCount: 1,
  excerpt: form.description,
  publishDate: new Date().toISOString(),
}
```

**Why each field:**

- `id: 0` — the server assigns the real id. The contract requires the field to be present, so we send `0` as a placeholder.
- `title`, `description` — from the form.
- `pageCount: 1` — required, no UI for it in this exercise. (Exercise 11 adds a real input.)
- `excerpt: form.description` — required; reusing the description is a pragmatic shortcut.
- `publishDate: new Date().toISOString()` — required ISO timestamp.

Hover any of these fields in the editor — TypeScript should tell you the field is required and what type it expects.

---

## Step 5 — Confirm the disabled-while-pending button

```tsx
<button
  type="submit"
  disabled={mutation.isPending}
  className="bg-primary text-primary-foreground rounded border px-3 py-1 disabled:opacity-50"
>
  {mutation.isPending ? "Creating..." : "Create book"}
</button>
```

`mutation.isPending` flips to `true` between `mutate(...)` and the request resolving. Disabling here prevents the double-submit problem.

The solution uses an ellipsis character (`Creating…`) instead of three dots (`Creating...`) — purely cosmetic. Either is fine.

---

## Step 6 — Delete the `// TODO:` header

Remove the three-line block once the submit is inlined.

---

## Step 7 — Verify in the browser

1. Save.
2. Open Exercise 4.
3. Type a title + description and click **Create book**.
4. Button briefly shows "Creating..." and is disabled.
5. Success toast appears at the bottom-right.
6. DevTools → Network → `POST /api/v1/Books` with the body shape above.
7. (Optional) Block the network call in DevTools and resubmit — the error toast should show the failure message.

**Note:** the books list elsewhere in the app may not update. That is on purpose — Exercise 5 is where you wire the invalidation.

---

## Code-change cheat sheet

| Change                                              | Required? |
| --------------------------------------------------- | --------- |
| Add `toast` success/error handlers                  | ✅ yes    |
| Call `mutation.mutate({ body: { ... } })` on submit | ✅ yes    |
| Inline `handleSubmit` into the `<form onSubmit={...}>` | optional but matches the solution |
| Delete `// TODO:` header                            | ✅ yes    |

---

## Common mistakes

- **Flattening the mutation arg.** `mutation.mutate(form)` is wrong. Always `mutation.mutate({ body: { ... } })`.
- **Awaiting `mutation.mutate`.** It returns a Promise but you should not await it for control flow — use `onSuccess`/`onError` instead.
- **Adding `enabled: false` to a mutation.** Mutations do not have `enabled`. You control when they run by when you call `mutate()`.
- **Skipping the `id: 0` placeholder.** The generated type requires `id`. TypeScript would have caught that — trust the squiggle.
