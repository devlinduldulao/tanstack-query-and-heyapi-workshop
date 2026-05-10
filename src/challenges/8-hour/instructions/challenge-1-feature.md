# Feature Challenge: Author Manager (CRUD + Optimistic UI)

Build a complete **Author Manager** that exercises every concept from Days 1–2 against the `/api/v1/Authors` endpoints.

## Challenge Description

You have a starter file that lists authors. Your job is to extend it into a real CRUD experience powered entirely by **generated Hey API contracts**.

## Requirements

- List authors using the generated authors read helper.
- Add an inline **Create Author** form (`firstName` + `lastName`) using the generated create-author contract and refresh the generated authors-list identifier on success.
- Add a **Delete** button per row using the generated delete-author contract with **optimistic UI**:
  - stop in-flight list refreshes
  - snapshot the current list
  - remove the row immediately
  - roll back from the snapshot on failure
  - reconcile with the same generated list identifier when finished
- Add an **Edit** flow using the generated update-author contract. Clicking a row should toggle inline edit fields and Save should submit the update.
- Disable buttons while their request is in flight.

## Checklist

- ✅ Authors list renders without a manual request layer.
- ✅ Creating an author appends it to the list with no full-page reload.
- ✅ Deleting an author removes it instantly; if the request fails, the row reappears.
- ✅ Editing an author updates the row, with the edit form closing on success.
- ✅ All reads and writes use generated helpers, **never** raw URL strings or hand-written cache identifiers.

> Keep your component small. If the file grows too much, extract helpers around generated contracts instead of adding another hand-built API layer.
