# Feature Challenge: Author Manager (CRUD + Optimistic UI)

Build a complete **Author Manager** that exercises every concept from Days 1–2 against the `/api/v1/Authors` endpoints.

## Challenge Description

You have a starter file that lists authors. Your job is to extend it into a real CRUD experience powered entirely by **generated** TanStack Query helpers.

## Requirements

- List authors using `getApiV1AuthorsOptions`.
- Add an inline **Create Author** form (`firstName` + `lastName`) using `postApiV1AuthorsMutation` and invalidate `getApiV1AuthorsQueryKey()` on success.
- Add a **Delete** button per row using `deleteApiV1AuthorsByIdMutation` with **optimistic UI**:
  - `onMutate`: cancel + snapshot + remove
  - `onError`: roll back from snapshot
  - `onSettled`: invalidate
- Add an **Edit** flow (`putApiV1AuthorsByIdMutation`) — clicking a row toggles inline edit fields; Save submits the mutation.
- Disable buttons while their mutation is `pending`.

## Checklist

- ✅ Authors list renders without manual `axios` calls.
- ✅ Creating an author appends it to the list with no full-page reload.
- ✅ Deleting an author removes it instantly; if the request fails, the row reappears.
- ✅ Editing an author updates the row, with the edit form closing on success.
- ✅ All four mutations use generated helpers, **never** raw URL strings.

> 💡 Keep your component small — extract a `useAuthorMutations()` hook if it grows past ~150 lines.
