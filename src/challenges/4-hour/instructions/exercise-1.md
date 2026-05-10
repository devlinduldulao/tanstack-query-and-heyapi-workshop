# Exercise 1: Generated Read Contracts

This exercise starts from a generated books contract and turns it into a reusable screen-level read. The point is to keep the transport and cache identity owned by the generated layer while the component adds only UI-specific behavior.

## Requirements

- Start from the generated books list helper already hinted in the starter file.
- Add screen-level cache policy:
  - `staleTime`: 60 seconds
  - `gcTime`: 15 minutes
  - `retry`: at most 2 retries
- Add a transform that returns only books with at least 200 pages, sorted by `pageCount` descending.
- Show clearly when the screen is refreshing in the background.
- Render the last successful update time.
- Do not add a hand-written URL, fetcher, or cache identifier.

## Discussion Prompt

If the backend changes this endpoint later, what code should stay stable in the component and what should be regenerated from the contract?

## Why This Matters

Senior teams keep components focused on presentation and screen rules. Generated contracts own the request details so invalidation, refactors, and backend changes stay predictable.

## Training Resources

- [Hey API - Get Started](https://heyapi.dev/openapi-ts/get-started)
- [Hey API - Plugins](https://heyapi.dev/openapi-ts/plugins)
