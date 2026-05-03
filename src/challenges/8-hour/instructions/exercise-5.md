# Exercise 5: Cache Invalidation

A successful mutation that doesn't update the UI is a failed feature. Use `queryClient.invalidateQueries` to keep your reads fresh.

## Requirements

- Use `useQueryClient()` to grab the client.
- After a successful book creation, call `queryClient.invalidateQueries({ queryKey: ["books"] })` in `onSuccess`.
- Confirm the books list re-fetches automatically.
- Bonus: use `setQueryData(["books"], updater)` to **immediately** prepend the new book without waiting for the network.

> 💡 `invalidateQueries` marks the cache stale and triggers an active refetch — it does not blow the cache away.

## Why This Matters

This is the single most important pattern in TanStack Query. Master it and 80% of cache management problems disappear.

## Training Resources

- [Invalidations from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)
- [Updates from Mutation Responses](https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses)
