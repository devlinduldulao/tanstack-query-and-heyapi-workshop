# Exercise 5: Generated Mutations + Zod Validation

Generated mutation options are useful. Generated mutation options plus generated Zod schemas are the moment the API layer starts feeling production-ready.

## Requirements

- Import `postApiV1BooksMutation` and `getApiV1BooksQueryKey` from `@/api/client/@tanstack/react-query.gen`.
- Import `zBook` from `@/api/client/zod.gen` and extend it with UI-level constraints:
  - title: required, minimum 3 characters
  - page count: required positive integer
- Validate the form payload before calling `mutation.mutate`.
- Use `postApiV1BooksMutation()` inside `useMutation` and invalidate the generated list key on success.
- Show validation errors separately from network errors.
- Disable the submit button while the mutation is pending.

> Generated schemas mirror the API contract. Your UI can extend them with product rules without retyping the whole payload shape.

## Discussion Prompt

Which bugs become cheaper when request payload validation, TypeScript types, and mutation options all come from the same OpenAPI source?

## Why This Matters

This is the production pattern: generated request shape, generated mutation function, generated invalidation key, and runtime validation before the network call.

## Training Resources

- [Hey API — Mutations](https://heyapi.dev/openapi-ts/plugins/tanstack-query#mutations)
- [Hey API — Zod](https://heyapi.dev/openapi-ts/plugins/zod)
- [Invalidating from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)
