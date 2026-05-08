# Exercise 2: Optimistic Updates

Slow networks shouldn't make your UI feel slow. Implement an optimistic delete using the full `onMutate / onError / onSettled` lifecycle.

## Requirements

- Implement a `useDeleteBook` hook that DELETEs `/api/v1/Books/{id}`.
- In `onMutate`:
  - `await queryClient.cancelQueries({ queryKey: ["books"] })`
  - Snapshot the previous list with `getQueryData`
  - Optimistically remove the deleted book via `setQueryData`
  - Return `{ previous }` as context
- In `onError`, roll back using the snapshot from context.
- In `onSettled`, invalidate `["books"]` to reconcile with the server.

> 💡 Always cancel inflight queries first or your optimistic update will be overwritten by a stale response.

## Why This Matters

This pattern is the difference between a snappy enterprise app and one that feels broken. It's also a frequent senior-level interview question.

## Training Resources

- [Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
