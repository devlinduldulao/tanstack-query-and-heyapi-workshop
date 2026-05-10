# Exercise 2: Master-Detail with Generated Contracts

This screen already has the right contract surface available. Your job is to wire list selection to a generated detail read without inventing a second manual data path.

## Requirements

- Use the generated books list helper for the left side of the screen.
- Hold the selected book id in component state.
- Use the generated single-book helper for the detail panel.
- Render the detail panel only after a valid selection exists.
- Display the selected book's title and description in the side panel.
- Do not add a hand-written cache identifier or endpoint string.

> The important idea is simple: one generated helper for the collection, one generated helper for the selected record, and no duplicated request logic.

## Why This Matters

Master-detail screens become fragile when teams build one-off fetch logic for the detail side. Generated contracts keep both halves aligned with the same backend source.

## Training Resources

- [Hey API - Plugins](https://heyapi.dev/openapi-ts/plugins)
