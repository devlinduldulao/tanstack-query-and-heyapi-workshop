# 8-Hour Completion Homework: Production-Ready Books Admin

Turn the demo app into a small production slice that a senior React developer would be comfortable defending in a code review.

## Scenario

Your team is adopting Hey API for an existing REST backend. Build a Books/Admin experience that proves the workflow is worth keeping.

## Requirements

1. **Generated-only API layer** — remove hand-written axios calls from the Books/Admin flow. Use generated SDK functions, `*Options`, `*Mutation`, and `*QueryKey` helpers.
2. **Query options module** — create a feature-level module that exports reusable query options for list, detail, search, and author-by-book views.
3. **Search + pagination** — derive `search`, `page`, and `pageSize` from generated reads while keeping the UI responsive as those values change.
4. **Detail route loading** — reuse one generated detail contract from both the screen and a route-level data loading step.
5. **Validated create/edit form** — import generated Zod schemas and extend them with UI-specific constraints before calling generated mutations.
6. **Delete flow with feedback** — use the generated delete contract, invalidate the generated list key on success, and show success/error toast notifications.
7. **Author join** — show authors for the selected book using the generated `getApiV1AuthorsAuthorsBooksByIdBookOptions` helper.
8. **Error boundaries** — convert one route to `useSuspenseQuery` with `<Suspense>` and `ErrorBoundary`.
9. **Devtools proof** — open TanStack Query Devtools and verify that generated keys are predictable, specific, and reused across reads and post-mutation refreshes.

## Acceptance Criteria

- No API URL strings are written in feature components.
- Generated keys remain the source of truth for reads and post-mutation refresh.
- Mutations invalidate generated keys, not string guesses.
- Form validation catches bad payloads before the network call.
- Delete actions show clear success and failure feedback through toast notifications.
- Route navigation reuses the same generated detail contract regardless of where loading begins.

## Stretch Goals

1. Add a consistent toast message style for create, update, and delete actions.
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

> Open the **TanStack Query Devtools** while working. The completion is not done until the cache story is easy to inspect and explain.
