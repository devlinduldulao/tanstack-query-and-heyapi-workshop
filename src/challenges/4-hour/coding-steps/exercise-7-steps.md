# Exercise 7 — Step-by-Step

> Goal: simulate real frontend-platform work. Sync the latest backend spec, regenerate the client, **observe** the new `CoverPhotos` resource, and ship a small cover-explorer UI from generated helpers only.

You are editing [`exercise-7.tsx`](../exercise-7.tsx). The reference output is [`solutions/exercise-7-end.tsx`](../solutions/exercise-7-end.tsx).

This is the most realistic exercise in the 4-hour track. You will run shell commands _before_ touching the component. Do not skip the commands — they are the whole lesson.

---

## Mental model first

Real frontend platform work has three phases:

1. **Sync the contract.** Pull the latest `swagger.yaml` from the backend and regenerate the client.
2. **Triage the diff.** Compare before/after in `swagger.yaml` and `src/api/client/` to know what changed.
3. **Ship.** Build a small UI slice from the new generated surface.

The starter file already has the impact-report and the layout. The two real edits are:

- replace the placeholder `TODO: ...` strings inside `impactSummary`
- replace the placeholder text with a real `<SelectedBookCoversPanel>` that uses the **newly generated** `getApiV1CoverPhotosBooksCoversByIdBookOptions`

Do the shell work first, then the component edits.

---

## Step 1 — Sync the spec

In a second terminal (do not stop `npm run dev`):

```bash
npm run update-swagger-bash
```

**What this does:** downloads the latest `swagger.yaml` from the backend and overwrites the local copy. Without it you cannot generate code for the new `CoverPhotos` endpoints.

**Note:** if you don't have bash on Windows (e.g. pure PowerShell with no Git Bash), the script may fail. Use Git Bash, WSL, or manually download `swagger.yaml` from the source listed in `package.json`. The instructions explicitly use this command, so try it first.

---

## Step 2 — Regenerate the client

```bash
npm run openapi-ts
```

**What this does:** reads `swagger.yaml` and writes fresh files into `src/api/client/`. Look at the output — Hey API will tell you how many operations were generated. After the new spec, you should see new helpers for `CoverPhotos`.

---

## Step 3 — Diff the change

```bash
git diff -- swagger.yaml src/api/client
```

**What to look for:**

- In `swagger.yaml`: new `paths:` entries under `/api/v1/CoverPhotos/...` and a new `CoverPhoto` schema.
- In `src/api/client/types.gen.ts`: a new `CoverPhoto` type.
- In `src/api/client/@tanstack/react-query.gen.ts`: new option builders like `getApiV1CoverPhotosBooksCoversByIdBookOptions` and `getApiV1CoverPhotosBooksCoversByIdBookQueryKey`.
- In `src/api/client/zod.gen.ts`: a new `zCoverPhoto`.
- In `src/api/client/sdk.gen.ts`: new function exports.

**Why this is the most valuable step:** until you have done a contract diff once, you do not really understand what "generated" buys you. Read the diff line by line.

---

## Step 4 — Type-check

```bash
npm run typecheck
```

**Why now:** if the new spec accidentally broke an existing usage, you want to catch it now, before you start writing new code on top of a half-broken client. With this dataset the typecheck should pass cleanly.

---

## Step 5 — Fill in the `impactSummary` (top of file)

The starter has:

```tsx
const impactSummary = [
  { label: "Live contract diff", value: "TODO: note the new CoverPhotos paths and schema added to swagger.yaml." },
  { label: "Generated client impact", value: "TODO: list the new generated cover-photo helpers created in src/api/client/." },
  { label: "Frontend action", value: "TODO: explain how the new endpoint changes the UI surface you can now build." },
];
```

Replace each `value` with your own observation from Step 3. The solution gives one possible wording:

```tsx
{ label: "Live contract diff",     value: "The backend added a new CoverPhotos resource, including list, detail, create, update, delete, and by-book endpoints." },
{ label: "Generated client impact", value: "Hey API generated a new CoverPhoto type plus SDK, TanStack Query, barrel, and Zod helpers for the new endpoints." },
{ label: "Frontend action",         value: "The UI can now ship a cover explorer immediately by composing the generated books list with the generated cover-by-book query." },
```

**Why write your own sentences:** in a real architecture review you will be the one explaining this. The TODO is _your_ note to your team, not a template.

---

## Step 6 — Build the `SelectedBookCoversPanel` component

This is the only real React code you write. Add it near the top of the file, right after the `impactSummary` array and before `Exercise7`:

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

**Walkthrough of each decision:**

- **`useSuspenseQuery` with a generated options builder.** Same pattern as Exercise 4 — list/detail with a per-row generated query.
- **`{ path: { idBook: selectedBookId } }`.** The arg shape is mandated by the generated type. `idBook` (not `bookId`) is the actual parameter name in the spec — Hey API uses whatever the backend declared. If you guess "bookId", TypeScript will tell you.
- **`covers.length === 0` empty state.** Some books legitimately have no covers; this is the friendly path.
- **`cover.id ?? cover.url` as the key.** `id` is optional in the spec, so this protects against a missing id by falling back to the URL.
- **`cover.url ?? "No URL returned"`.** Same `?? fallback` pattern.

---

## Step 7 — Add the import for the new helper

At the top of the file, extend the import:

```tsx
import {
  getApiV1BooksOptions,
  getApiV1CoverPhotosBooksCoversByIdBookOptions, // ← new
} from "@/api/client/@tanstack/react-query.gen";
```

You may want to remove the now-unused `import type { Book } from "@/api/client"` — the solution does not need it because `select` infers the type.

You also need `Suspense` from React:

```tsx
import { Suspense, useState } from "react";
```

---

## Step 8 — Replace the placeholder in the cover panel `<section>`

Find this block:

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

Replace the `else` branch with a `<Suspense>` boundary that renders `SelectedBookCoversPanel`:

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

**Why a local `<Suspense>` boundary:** without it, the entire `Exercise7` would suspend on every selection. The local boundary keeps the list and the impact report visible while only the cover panel shows a spinner.

---

## Step 9 — Delete the `// TODO:` header

Once the impact summary, the new component, and the JSX wiring are done, delete the four-line TODO at the top.

---

## Step 10 — Verify in the browser

1. Save.
2. Open Exercise 7.
3. Click a book on the left.
4. The right "Selected book covers" panel should briefly show "Loading selected book covers..." then render a list of cover URLs.
5. DevTools → Network → `GET /api/v1/CoverPhotos/books/covers/{idBook}` fires only after a selection.
6. The list and the impact report stay rendered the whole time — proof that the suspense boundary is correctly localized.

---

## Step 11 — (Critical) Do not commit the regenerated files until you intend to

The contract sync changes a lot of files. If the workshop's `main` branch is still on the pre-`CoverPhotos` spec, you should either:

- Commit the regenerated files in a clean PR titled "sync swagger + regenerate Hey API client", or
- Stash them with `git stash` before pushing exercise work.

Real-world reviewers do not want spec-sync and feature work mixed in one commit. Mention this to your team lead before merging.

---

## Code-change cheat sheet

| Action                                                            | Where                            |
| ----------------------------------------------------------------- | -------------------------------- |
| Run `npm run update-swagger-bash`                                 | terminal                         |
| Run `npm run openapi-ts`                                          | terminal                         |
| Run `git diff -- swagger.yaml src/api/client`                     | terminal                         |
| Run `npm run typecheck`                                           | terminal                         |
| Replace `TODO:` values in `impactSummary`                         | top of `exercise-7.tsx`          |
| Add `SelectedBookCoversPanel` component                           | above `Exercise7`                |
| Add `getApiV1CoverPhotosBooksCoversByIdBookOptions` import        | imports                          |
| Add `Suspense` import from "react"                                | imports                          |
| Replace placeholder `<p>` with `<Suspense><SelectedBookCoversPanel/></Suspense>` | the cover-panel `<section>` |
| Delete `// TODO:` header                                          | top of file                      |

---

## Common mistakes

- **Editing files in `src/api/client/` to "add" the cover helpers.** Always regenerate. Manual edits will be wiped.
- **Guessing the path param as `bookId`.** It is `idBook` in this spec. Trust the generated type.
- **Wrapping `Exercise7` itself in `<Suspense>` instead of a local boundary.** The list would disappear on every click.
- **Skipping the diff.** The whole point is to _see_ the new surface; skipping `git diff` defeats the lesson.
