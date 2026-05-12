# Exercise 14 — Step-by-Step

> Goal: simulate real frontend-platform work. Sync the latest backend spec, regenerate the client, **observe** the new `CoverPhotos` resource, and ship a small cover-explorer UI from generated helpers only.

You are editing [`exercise-14.tsx`](../exercise-14.tsx). Reference: [`solutions/exercise-14-end.tsx`](../solutions/exercise-14-end.tsx).

This is the most realistic exercise in the 8-hour track. You will run shell commands _before_ touching the component. Do not skip the commands — they are the whole lesson.

---

## Mental model first

Real frontend platform work has three phases:

1. **Sync the contract.** Pull the latest `swagger.yaml` from the backend; regenerate the client.
2. **Triage the diff.** Compare before/after in `swagger.yaml` and `src/api/client/` to know what changed.
3. **Ship.** Build a small UI slice from the new generated surface.

The starter has the impact-report scaffold and the layout. The two real edits are:

- replace the `TODO: ...` strings inside `impactSummary`
- replace the placeholder text with a real `<SelectedBookCoversPanel>` using the **newly generated** `getApiV1CoverPhotosBooksCoversByIdBookOptions`

Do the shell work first, then the component edits.

---

## Step 1 — Sync the spec

```bash
npm run update-swagger-bash
```

**What this does:** downloads the latest `swagger.yaml` from the backend and overwrites the local copy.

If you don't have bash on Windows (e.g. pure PowerShell, no Git Bash), the script may fail. Use Git Bash, WSL, or manually download `swagger.yaml`. The instructions use this command explicitly.

---

## Step 2 — Regenerate the client

```bash
npm run openapi-ts
```

**What this does:** reads `swagger.yaml` and writes fresh files into `src/api/client/`. Hey API reports how many operations it generated. With the new spec, you should see new helpers for `CoverPhotos`.

---

## Step 3 — Diff the change

```bash
git diff -- swagger.yaml src/api/client
```

**What to look for:**

- In `swagger.yaml`: new `paths:` under `/api/v1/CoverPhotos/...` and a new `CoverPhoto` schema.
- In `src/api/client/types.gen.ts`: a new `CoverPhoto` type.
- In `src/api/client/@tanstack/react-query.gen.ts`: new option builders like `getApiV1CoverPhotosBooksCoversByIdBookOptions` and matching `QueryKey` helpers.
- In `src/api/client/zod.gen.ts`: a new `zCoverPhoto`.
- In `src/api/client/sdk.gen.ts`: new function exports.

**This is the most valuable step.** Read the diff line by line.

---

## Step 4 — Type-check

```bash
npm run typecheck
```

If the new spec accidentally broke an existing usage, you want to catch it now. With this dataset, the typecheck should pass cleanly.

---

## Step 5 — Fill in the `impactSummary`

Starter:

```tsx
const impactSummary = [
  { label: "Live contract diff", value: "TODO: note the new CoverPhotos paths and schema added to swagger.yaml." },
  { label: "Generated client impact", value: "TODO: list the new generated cover-photo helpers created in src/api/client/." },
  { label: "Frontend action", value: "TODO: explain how the new endpoint changes the UI surface you can now build." },
];
```

Replace each `value` with your own observation from Step 3. One possible wording from the solution:

```tsx
{ label: "Live contract diff", value: "The backend added a new CoverPhotos resource, including list, detail, create, update, delete, and by-book endpoints." },
{ label: "Generated client impact", value: "Hey API generated a new CoverPhoto type plus SDK, TanStack Query, barrel, and Zod helpers for the new endpoints." },
{ label: "Frontend action", value: "The UI can now ship a cover explorer immediately by composing the generated books list with the generated cover-by-book query." },
```

**Why write your own:** in a real architecture review you will be the one explaining this.

---

## Step 6 — Build `SelectedBookCoversPanel`

Add this component near the top of the file, after `impactSummary` and before `Exercise14`:

```tsx
function SelectedBookCoversPanel({ selectedBookId }: { selectedBookId: number }) {
  const { data: covers } = useSuspenseQuery(
    getApiV1CoverPhotosBooksCoversByIdBookOptions({ path: { idBook: selectedBookId } }),
  );

  return (
    <div className="mt-2 space-y-2">
      {covers.length === 0 ? (
        <p className="text-muted-foreground">No covers returned for this book.</p>
      ) : (
        <ul className="space-y-2">
          {covers.map((cover) => (
            <li key={cover.id ?? cover.url} className="rounded border p-2">
              <p className="font-medium">Cover #{cover.id ?? "unknown"}</p>
              <p className="text-muted-foreground mt-1 break-all text-xs">{cover.url ?? "No URL returned"}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="text-muted-foreground text-xs">
        This panel mounts only after selection, so the related-cover query stays conditional without hand-written fetch logic.
      </p>
    </div>
  );
}
```

**Walkthrough:**

- **`useSuspenseQuery` with a generated options builder.** Same pattern as Exercises 2 and 9.
- **`{ path: { idBook: selectedBookId } }`.** The arg shape is mandated by the generated type. `idBook` (not `bookId`) is the parameter name in the spec — Hey API uses whatever the backend declared. If you guess "bookId", TypeScript will tell you.
- **`covers.length === 0` empty state.** Some books legitimately have no covers.
- **`cover.id ?? cover.url` as key.** `id` is optional in the spec.
- **`cover.url ?? "No URL returned"`.** Same defensive pattern.

---

## Step 7 — Update imports

```tsx
import { Suspense, useState } from "react"; // ← add Suspense
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getApiV1BooksOptions,
  getApiV1CoverPhotosBooksCoversByIdBookOptions, // ← new
} from "@/api/client/@tanstack/react-query.gen";
```

You may want to remove the now-unused `import type { Book } from "@/api/client"` — the solution does not need it because `select` infers the type.

---

## Step 8 — Replace the placeholder in the cover-panel `<section>`

Find:

```tsx
<section className="rounded border p-3">
  <h3 className="font-semibold">Selected book covers</h3>
  {!selectedBookId ? (
    <p className="text-muted-foreground mt-2">Select a book to mount the generated cover-photo query.</p>
  ) : (
    <p className="text-muted-foreground mt-2">
      TODO: render covers with getApiV1CoverPhotosBooksCoversByIdBookOptions({" "}
      {`{ path: { idBook: selectedBookId } }`}).
    </p>
  )}
</section>
```

Replace the `else` branch with a `<Suspense>` boundary wrapping `SelectedBookCoversPanel`:

```tsx
<section className="rounded border p-3">
  <h3 className="font-semibold">Selected book covers</h3>
  {!selectedBookId ? (
    <p className="text-muted-foreground mt-2">Select a book to mount the generated cover-photo query.</p>
  ) : (
    <Suspense fallback={<p className="text-muted-foreground mt-2">Loading selected book covers...</p>}>
      <SelectedBookCoversPanel selectedBookId={selectedBookId} />
    </Suspense>
  )}
</section>
```

**Why a local `<Suspense>`:** without it, the entire `Exercise14` would suspend on every selection. The local boundary keeps the list and impact report visible while only the cover panel spins.

---

## Step 9 — Delete the `// TODO:` header

Remove the four-line block.

---

## Step 10 — Verify in the browser

1. Save.
2. Open Exercise 14.
3. Click a book.
4. Right panel briefly shows "Loading selected book covers..." then renders the cover URLs.
5. DevTools → Network → `GET /api/v1/CoverPhotos/books/covers/{idBook}` fires only after selection.
6. The list and impact report stay rendered throughout — proof that the suspense boundary is localized.

---

## Step 11 — Critical commit hygiene

Contract sync touches many files. Either:

- Commit the regenerated files in a clean PR titled "sync swagger + regenerate Hey API client", **or**
- Stash them with `git stash` before pushing your exercise work.

Reviewers do not want spec-sync and feature work mixed in one commit.

---

## Code-change cheat sheet

| Action                                                                                | Where                            |
| ------------------------------------------------------------------------------------- | -------------------------------- |
| Run `npm run update-swagger-bash`                                                     | terminal                         |
| Run `npm run openapi-ts`                                                              | terminal                         |
| Run `git diff -- swagger.yaml src/api/client`                                         | terminal                         |
| Run `npm run typecheck`                                                               | terminal                         |
| Replace `TODO:` values in `impactSummary`                                             | top of `exercise-14.tsx`         |
| Add `SelectedBookCoversPanel` component                                               | above `Exercise14`               |
| Add `getApiV1CoverPhotosBooksCoversByIdBookOptions` import                            | imports                          |
| Add `Suspense` import from "react"                                                    | imports                          |
| Replace placeholder `<p>` with `<Suspense><SelectedBookCoversPanel/></Suspense>`      | the cover-panel `<section>`      |
| Delete `// TODO:` header                                                              | top of file                      |

---

## Common mistakes

- **Editing files in `src/api/client/` to add the cover helpers.** Always regenerate. Manual edits are wiped.
- **Guessing the path param as `bookId`.** It is `idBook` in this spec. Trust the generated type.
- **Wrapping `Exercise14` itself in `<Suspense>` instead of a local boundary.** The list would disappear on every click.
- **Skipping the diff.** The whole point is to _see_ the new surface.
