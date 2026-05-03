# Exercise 3: Loading, Error & Background States

`isPending`, `isFetching`, `isError`, `isRefetching` — they look similar but mean very different things. Get them right and your UX feels instant.

## Requirements

- Display a **full skeleton** when `isPending` is `true` (first load, no cache).
- Display a **subtle "Refreshing…" indicator** when `isFetching && !isPending` (background refetch).
- Render the friendly `error.message` when `isError` is `true`.
- Add a **Retry** button that calls `refetch()`.
- Wire a manual **Refresh** button that calls `refetch()` even when data is fresh.

> 💡 `isPending` only flips back to `true` when there is no cached data. Background refreshes use `isFetching`.

## Why This Matters

Most teams ship apps that flash a spinner on every revalidation. Knowing the difference is the mark of a senior React dev.

## Training Resources

- [Query Status](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
- [Background Fetching Indicators](https://tanstack.com/query/latest/docs/framework/react/guides/background-fetching-indicators)
