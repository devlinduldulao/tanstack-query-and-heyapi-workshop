# Exercise 2: Query Keys & Dependent Queries

Query keys are how TanStack Query identifies, deduplicates, and invalidates cached data. They also unlock **dependent queries**.

## Requirements

- Implement `useBook(id)` that calls `useQuery` with key `["book", id]`.
- Use the `enabled` option so the query only fires when `id` is truthy.
- In the component, hold the selected book id in state.
- When the user clicks a book in the list, fetch its details using your hook.
- Display the selected book's title and description in a side panel.

> 💡 The structure of your query key matters: keep it serializable, keep variables in the array, and put the most specific identifier last.

## Why This Matters

- Bad keys = stale data and impossible cache invalidation.
- `enabled` is the canonical way to model dependent fetches without `useEffect`.

## Training Resources

- [Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Dependent Queries](https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries)
