# Exercise 1: Query Options as a Contract

You already know `useQuery`. This exercise is about turning a query into a reusable contract: stable key, abortable fetcher, cache policy, transformed data, and a UI that does not flash on every background refresh.

## Requirements

- Move the query definition into a `bookCatalogOptions` object created with `queryOptions()`.
- Use a serializable key that includes the business input: `minPages`.
- Pass TanStack Query's `signal` to `axios` so abandoned requests are cancelled.
- Set intentional cache policy:
  - `staleTime`: 60 seconds
  - `gcTime`: 15 minutes
  - `retry`: at most 2 retries
- Use `select` to return only books with at least 200 pages, sorted by `pageCount` descending.
- Render `isPending`, `isError`, `isFetching`, and `dataUpdatedAt` as separate states.

## Discussion Prompt

Where should this options object live in a real codebase: next to the route, next to the API module, or in a feature-level `queries.ts` file? What makes invalidation easier six months later?

## Why This Matters

Senior teams do not sprinkle anonymous query objects across components. They make cache behavior explicit, reusable, testable, and easy to invalidate.

## Training Resources

- [Query Options](https://tanstack.com/query/latest/docs/framework/react/guides/query-options)
- [Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Query Functions](https://tanstack.com/query/latest/docs/framework/react/guides/query-functions)
