# Exercise 6: Optimistic Deletes with Generated Contracts

Slow networks should not make the UI feel slow. In this lab you will complete an optimistic delete flow while keeping the generated read and write contracts aligned.

## Requirements

- Use the generated delete-book contract.
- Use the generated books-list identifier everywhere in the optimistic flow.
- Before writing optimistic state, stop any in-flight refresh for that same list.
- Snapshot the previous list, remove the deleted row immediately, and return the snapshot as context.
- If the request fails, restore the snapshot.
- When the request finishes, refresh the same generated list identifier.

> The most common failure here is mixing two different cache identities for the same screen. One generated list identifier should drive snapshot, optimistic update, rollback, and reconciliation.

## Why This Matters

Optimistic UI only feels correct when the read surface and the write surface stay connected through one consistent generated contract.

## Training Resources

- [Hey API - Plugins](https://heyapi.dev/openapi-ts/plugins)
