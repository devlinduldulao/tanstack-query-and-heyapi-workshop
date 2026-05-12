# Exercise 8 — Step-by-Step

> Goal: confirm that a screen has been moved off a manual API layer onto generated Hey API contracts, and polish the "contract panel" sidebar so a code reviewer can see exactly what the UI no longer owns.

You are editing [`exercise-8.tsx`](../exercise-8.tsx). Reference: [`solutions/exercise-8-end.tsx`](../solutions/exercise-8-end.tsx).

The starter is already on the generated read helper — the manual-axios drift has been removed for you. Two small edits remain to make the contract panel fully informative.

---

## Mental model first

Real adoption migrations follow this pattern:

1. **Before:** a hand-written DTO, a hardcoded URL, and a custom `fetch` wrapper inside the component.
2. **Refactor step:** delete the DTO, delete the URL string, and replace the fetch with `useSuspenseQuery(getApiV1BooksOptions())`.
3. **After:** the component renders pure UI, the contract lives in `src/api/client/`, and a one-paragraph "contract panel" tells future readers where the API surface really lives.

The starter is already at step 3. The lesson is to recognize what is _absent_ (no manual DTO, no URL string) and to polish the documentation that explains why.

---

## Step 1 — Read the TODO header

```tsx
// TODO:
// 1. Use getApiV1BooksOptions() instead of a hand-written request.
// 2. Let the generated query key come from Hey API.
// 3. Keep the contract panel focused on what the UI no longer owns.
// 4. Remove hand-written DTOs and raw URL strings.
```

Items 1, 2, and 4 are already done. Your job is item 3 — improve the contract panel.

---

## Step 2 — Confirm the read

```tsx
const { data = [] } = useSuspenseQuery(getApiV1BooksOptions());
```

One line. One generated helper. Nothing else. **This is the win.**

Compare to what a manual version would look like:

```tsx
// What you do NOT have to write anymore:
type Book = { id?: number; title?: string; description?: string; pageCount?: number; ... };
const BOOKS_URL = "https://fakerestapi.azurewebsites.net/api/v1/Books";
async function fetchBooks(): Promise<Book[]> { /* ... */ }
const queryKey = ["books"] as const;
const { data = [] } = useSuspenseQuery({ queryKey, queryFn: fetchBooks });
```

Five lines of drift-prone hand-written code, replaced by one line of generated contract use. Look at the diff side-by-side once — that is the lesson.

---

## Step 3 — Confirm the list JSX

```tsx
<ul className="space-y-1">
  {data.slice(0, 10).map((book) => (
    <li key={book.id}>{book.title}</li>
  ))}
</ul>
```

Generic list rendering. The UI knows nothing about how the data arrived. **That is the goal of the migration.**

---

## Step 4 — Improve the contract panel

Starter:

```tsx
<aside className="rounded border p-3 text-xs">
  <p className="font-semibold">Contract panel</p>
  <p className="mt-2 font-mono">GET /api/v1/Books</p>
  <p className="text-muted-foreground mt-2">Hey API now owns the URL, request function, and query key.</p>
</aside>
```

Solution:

```tsx
<aside className="rounded border p-3 text-xs">
  <p className="font-semibold">Contract panel</p>
  <p className="mt-2 font-mono">GET /api/v1/Books</p>
  <p className="text-muted-foreground mt-2">Query options: src/api/client/@tanstack/react-query.gen.ts</p>
  <p className="text-muted-foreground mt-2">UI no longer owns URL strings, request functions, or query keys.</p>
</aside>
```

**Two changes:**

1. **Add a "Query options" line** pointing to the actual generated file. This is the breadcrumb a future engineer follows to find the contract source.
2. **Reword the bottom line** to enumerate what the UI _no longer owns_. The starter said "Hey API now owns ..." — past tense, vague. The solution says "UI no longer owns ..." — declarative, specific, and matches the lesson's framing.

**Why the wording matters:** in a code-review tool, this kind of inline documentation prevents the next dev from re-introducing the drift. "Components stop owning X, Y, Z" reads as a rule. "Hey API owns X, Y, Z" reads as trivia.

---

## Step 5 — Delete the `// TODO:` header

Remove the four-line block once the contract panel is updated.

---

## Step 6 — Verify in the browser

1. Save.
2. Open Exercise 8.
3. Left column: a 10-item book list.
4. Right column: a small contract panel showing the endpoint path, the generated file path, and the ownership statement.
5. DevTools → Network → one `GET /api/v1/Books`.

Open `src/api/client/@tanstack/react-query.gen.ts` and search for `getApiV1BooksOptions` — confirm it exists and that the path in the contract panel matches reality.

---

## Code-change cheat sheet

| Change                                                          | Required? |
| --------------------------------------------------------------- | --------- |
| Add `<p>Query options: src/api/client/@tanstack/react-query.gen.ts</p>` | ✅ yes |
| Reword final `<p>` to "UI no longer owns URL strings, request functions, or query keys." | ✅ yes |
| Delete `// TODO:` header                                        | ✅ yes    |
| Anywhere else                                                   | leave alone |

---

## Why this is more than cosmetic

Inline contract documentation is the difference between a one-time migration and a sustained pattern. In six months, when a new dev wants to add a "search books" endpoint, they will look at this panel, see the breadcrumb to the generated file, and know to extend the contract there — not write a new manual fetch.

That is the cultural win Hey API enables. The component is the visible deliverable; the panel is the social contract.

---

## Common mistakes

- **Adding back a hand-written `type Book = ...`.** Forbidden. Use the generated `Book` type from `@/api/client` if you need it.
- **Hardcoding the URL in the contract panel as a "fallback".** No. The panel exists precisely because the URL lives in the spec.
- **Pointing the panel to `sdk.gen.ts` instead of `react-query.gen.ts`.** Both exist, but the UI consumes the TanStack Query helpers. The panel should point at what the UI actually imports.
