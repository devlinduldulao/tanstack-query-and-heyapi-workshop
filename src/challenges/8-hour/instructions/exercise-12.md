# Exercise 12: Prefetching That Users Feel

Prefetching is not a buzzword. Users should feel it as "the detail panel appeared instantly." This exercise uses generated query options for both manual prefetch and the route-loader mental model.

## Requirements

- Use `useQueryClient()`.
- Add a **Prefetch book #1** button that calls `prefetchQuery` with `getApiV1BooksByIdOptions({ path: { id: 1 } })`.
- Set a useful `staleTime` on the prefetched query so it stays warm long enough to observe.
- Add local state to delay rendering the detail component.
- When the detail component renders, call `useQuery` with the exact same generated options.
- Show whether the detail is fetching in the background or came from warm cache.
- Read the loader sketch below and explain how it maps to `context.queryClient.ensureQueryData(...)` in a real TanStack Router route.

## Loader Sketch

```ts
export const Route = createFileRoute("/books/$bookId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getApiV1BooksByIdOptions({ path: { id: Number(params.bookId) } })),
});
```

## Why This Matters

The same generated options object can power component queries, hover prefetch, route loaders, and cache hydration. That consistency is where TanStack Router + TanStack Query + Hey API becomes a strong frontend architecture.

## Training Resources

- [Prefetching](https://tanstack.com/query/latest/docs/framework/react/guides/prefetching)
- [TanStack Router Data Loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)
