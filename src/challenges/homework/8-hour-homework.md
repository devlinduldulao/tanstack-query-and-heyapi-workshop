# 8-Hour Capstone Homework: Production-Ready Books Admin

Turn the demo app into a small production slice that a senior React developer would be comfortable defending in a code review.

## Scenario

Your team is adopting Hey API for an existing REST backend. Build a Books/Admin experience that proves the workflow is worth keeping.

## Requirements

1. **Generated-only API layer** — remove hand-written axios calls from the Books/Admin flow. Use generated SDK functions, `*Options`, `*Mutation`, and `*QueryKey` helpers.
2. **Query options module** — create a feature-level module that exports reusable query options for list, detail, search, and author-by-book views.
3. **Search + pagination** — include `search`, `page`, and `pageSize` in the query key. Use `keepPreviousData` and prefetch the next page.
4. **Detail route prefetch** — use a TanStack Router loader with `context.queryClient.ensureQueryData(...)` for a book detail route.
5. **Validated create/edit form** — import generated Zod schemas and extend them with UI-specific constraints before calling generated mutations.
6. **Optimistic delete** — implement full `onMutate`, `cancelQueries`, snapshot, rollback, and generated-key invalidation.
7. **Author join** — show authors for the selected book using the generated `getApiV1AuthorsAuthorsBooksByIdBookOptions` helper.
8. **Error boundaries** — convert one route to `useSuspenseQuery` with `<Suspense>` and `ErrorBoundary`.
9. **Devtools proof** — open TanStack Query Devtools and verify that query keys are predictable, specific, and reused across reads, prefetches, invalidations, and optimistic writes.

## Acceptance Criteria

- No API URL strings are written in feature components.
- Query keys include every variable that changes the result.
- Mutations invalidate generated keys, not string guesses.
- Form validation catches bad payloads before the network call.
- Optimistic delete never resurrects rows after a background refetch.
- Route navigation feels instant after hover or loader prefetch.

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
