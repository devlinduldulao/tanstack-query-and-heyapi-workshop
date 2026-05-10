# Feature Challenge: Author Manager (CRUD + Toast Feedback)

Build a complete **Author Manager** that exercises every concept from Days 1–2 against the `/api/v1/Authors` endpoints.

## Challenge Description

You have a starter file that lists authors. Your job is to extend it into a real CRUD experience powered entirely by **generated Hey API contracts**.

## Requirements

- List authors using the generated authors read helper.
- Add an inline **Create Author** form (`firstName` + `lastName`) using the generated create-author contract and refresh the generated authors-list identifier on success.
- Add a **Delete** button per row using the generated delete-author contract with success/error toast feedback and a generated list refresh on success.
- Add an **Edit** flow using the generated update-author contract. Clicking a row should toggle inline edit fields and Save should submit the update.
- Disable buttons while their request is in flight.

## Checklist

- ✅ Authors list renders without a manual request layer.
- ✅ Creating an author appends it to the list with no full-page reload.
- ✅ Deleting an author refreshes the list on success and shows clear failure feedback when the request fails.
- ✅ Editing an author updates the row, with the edit form closing on success.
- ✅ All reads and writes use generated helpers, **never** raw URL strings or hand-written cache identifiers.

> Keep your component small. If the file grows too much, extract helpers around generated contracts instead of adding another hand-built API layer.
