# 4-Hour Capstone Homework: Production-Ready Books Admin

Turn the demo app into one tight production slice that proves the compressed track landed.

## Scenario

Your team is adopting Hey API for an existing REST backend. Build the smallest Books/Admin experience that proves the workflow is worth keeping.

## Requirements

1. **Generated-only API layer** — remove hand-written axios calls from the Books/Admin flow. Use generated SDK functions, `*Options`, `*Mutation`, and `*QueryKey` helpers.
2. **Search + pagination** — include `search`, `page`, and `pageSize` in the query key. Use `keepPreviousData` and prefetch the next page.
3. **Validated create form** — import generated Zod schemas and extend them with UI-specific constraints before calling generated mutations.
4. **Optimistic delete** — implement full `onMutate`, `cancelQueries`, snapshot, rollback, and generated-key invalidation.
5. **Devtools proof** — open TanStack Query Devtools and verify that query keys are predictable, specific, and reused across reads, invalidations, and optimistic writes.

## Acceptance Criteria

- No API URL strings are written in feature components.
- Query keys include every variable that changes the result.
- Mutations invalidate generated keys, not string guesses.
- Form validation catches bad payloads before the network call.
- Optimistic delete never resurrects rows after a background refetch.
- The compressed slice demonstrates why the team should keep Hey API in future projects.

## Stretch Goals

1. Add mutation success/error toasts with `sonner`.
2. Add a small cache-debug panel that prints the generated query key used by the current route.
3. Temporarily change a field in `swagger.yaml`, regenerate, and write down which compile errors were useful.

## Reading

- [Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Query Options](https://tanstack.com/query/latest/docs/framework/react/guides/query-options)
- [Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)
- [Suspense Guide](https://tanstack.com/query/latest/docs/framework/react/guides/suspense)
- [TanStack Router — Data Loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)
- [Hey API — TanStack Query Plugin](https://heyapi.dev/openapi-ts/plugins/tanstack-query)
- [Hey API — Plugins: Zod](https://heyapi.dev/openapi-ts/plugins/zod)

> Open the **TanStack Query Devtools** while working. The capstone is not done until the cache story is easy to inspect and explain.
