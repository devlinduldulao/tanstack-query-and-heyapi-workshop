# Exercise 9: Generated Options as Query Factories

The TanStack Query plugin is where Hey API becomes hard to give up. It generates the query function, the query key, and the mutation options from the same OpenAPI operation.

## Requirements

- Import `getApiV1BooksOptions`, `getApiV1BooksByIdOptions`, and `getApiV1BooksQueryKey` from the generated TanStack Query file.
- Use `useQuery(getApiV1BooksOptions())` for the list.
- Use a selected book id and `getApiV1BooksByIdOptions({ path: { id } })` for details.
- Add `enabled` to the detail query so it does not run before a selection exists.
- Layer app-specific behavior on top of generated options:
  - `select` only the fields needed by the list UI
  - `staleTime` for the list
  - a targeted invalidation button that uses `getApiV1BooksQueryKey()`

## Discussion Prompt

When your backend adds a required path/query/body parameter, which approach fails louder: manual query objects or generated options?

## Why This Matters

Generated options are query factories without the maintenance burden. They give you consistent keys for reads, invalidation, prefetching, loaders, and optimistic updates.

## Training Resources

- [Hey API — TanStack Query Plugin](https://heyapi.dev/openapi-ts/plugins/tanstack-query)
- [TanStack Query — Query Options](https://tanstack.com/query/latest/docs/framework/react/guides/query-options)
- [TanStack Query — Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)
