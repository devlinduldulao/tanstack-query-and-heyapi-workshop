# Exercise 12: Warm Cache Without Manual Warm-Up

This exercise keeps the detail screen contract-driven without adding a manual warm-up step. The goal is to observe how one generated detail contract can support both immediate render and later refresh behavior.

## Requirements

- Use the generated single-book helper for book `1`.
- Set a useful freshness window so the cached detail stays warm long enough to observe.
- Add local state that delays rendering the detail panel until the user clicks a button.
- Show whether the detail is currently refreshing or already available from warm cache.
- Explain how the same generated detail contract could also be reused by a route-level data loading step in a different architecture.
- Do not add a manual cache-warm button or a second request path.

## Why This Matters

One generated detail contract should be reusable across screen entry points. That is valuable even when you choose not to warm the cache ahead of time.

## Training Resources

- [Hey API - Get Started](https://heyapi.dev/openapi-ts/get-started)
