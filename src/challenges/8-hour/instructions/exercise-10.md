# Exercise 10: Suspense Queries

`useSuspenseQuery` lets you delete loading branches from your component bodies and rely on Suspense boundaries instead.

## Requirements

- Replace `useQuery` with `useSuspenseQuery`.
- Wrap the consuming component in `<Suspense fallback={...}>`.
- Wrap that in an `ErrorBoundary` (from `react-error-boundary`).
- Notice your component no longer needs `isPending` / `isError` checks — `data` is always defined.

> 💡 Suspense queries assume the data exists. Always pair them with both an `ErrorBoundary` and a `Suspense` boundary.

## Why This Matters

Suspense + TanStack Router loaders + `useSuspenseQuery` is the modern recommended data-fetching pattern. It composes beautifully and removes huge amounts of conditional UI logic.

## Training Resources

- [`useSuspenseQuery`](https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery)
- [Suspense Guide](https://tanstack.com/query/latest/docs/framework/react/guides/suspense)
