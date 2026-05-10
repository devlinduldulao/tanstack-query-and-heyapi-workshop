# Exercise 5: Refresh Generated Reads After Writes

A successful write that leaves the list stale is still a broken feature. This exercise is about reconnecting the create flow to the generated books-list identity.

## Requirements

- Keep the generated books list helper as the screen source of truth.
- After a successful create, refresh the generated books-list identifier.
- Confirm the list updates automatically after success.
- Bonus: prepend the new record optimistically to that same generated list before the refresh finishes.

> The critical rule is consistency: the same generated list identity should back both the visible screen and the post-create refresh.

## Why This Matters

Most stale UI bugs are not network bugs. They come from refreshing the wrong cache entry or forgetting to reconnect a write to the read that users are actually seeing.

## Training Resources

- [Hey API - Get Started](https://heyapi.dev/openapi-ts/get-started)
