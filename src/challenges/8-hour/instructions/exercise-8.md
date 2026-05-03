# Exercise 8: Replace Manual API Drift

The starter intentionally has the problems we see in production: a hand-written DTO, a string URL, and a query function that silently drifts from the backend contract.

## Requirements

- Delete the hand-written `BookPreview` type.
- Import `getApiV1Books` and the generated `Book` type from `@/api/client`.
- Replace `axios.get(...)` with the generated SDK call.
- Preserve an explicit query key for now so you can compare this approach with generated `*Options` in the next exercise.
- Add a small contract panel that shows:
  - endpoint path
  - source file that generated the SDK function
  - what the UI code no longer owns

## Discussion Prompt

What breaks first in a manual axios layer when the backend changes: the URL, the request body, the response shape, the query key, or the runtime validation? Which of those does Hey API remove?

## Why This Matters

This is the first adoption win: your React component no longer owns endpoint strings or response DTOs. The OpenAPI contract does.

## Training Resources

- [Hey API — Client (Axios)](https://heyapi.dev/openapi-ts/clients/axios)
- [TanStack Query — Query Functions](https://tanstack.com/query/latest/docs/framework/react/guides/query-functions)
