# Exercise 5: Generated Writes with UI Guards

Generated write contracts are most useful when the form stays small and the request shape still comes from the contract. In this exercise you will submit a new book without introducing a hand-written payload model.

## Requirements

- Use the generated create-book contract from the client.
- Build the request body from the generated shape the API expects.
- Add small UI-level guards before submit:
  - title is required and at least 3 characters
  - page count is present and positive
- Show UI-level validation messages separately from request failures.
- Refresh the generated books-list identifier after a successful create.
- Disable submit while the request is in flight.

> The important separation is this: the API contract owns the request shape, while the form owns only product-specific checks and messaging.

## Discussion Prompt

Which bugs become cheaper when request shape, endpoint wiring, and cache refresh all come from the same generated source?

## Why This Matters

This is the production pattern: generated write contract, generated refresh target, and lightweight UI guards instead of a second hand-maintained data model.

## Training Resources

- [Hey API - Plugins](https://heyapi.dev/openapi-ts/plugins)
