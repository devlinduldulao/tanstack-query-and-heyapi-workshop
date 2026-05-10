# Exercise 2: Optimistic Deletes with Generated Contracts

Slow networks should not make the UI feel slow. In this lab you will finish an optimistic delete flow without inventing any manual endpoint strings or cache identifiers.

## Requirements

- Use the generated delete contract for a single book.
- Use the generated books-list identifier everywhere in the optimistic flow.
- Before writing optimistic state, stop any in-flight refresh for that same list.
- Snapshot the previous list, remove the deleted row immediately, and return the snapshot as context.
- If the request fails, restore the snapshot.
- When the request finishes, refresh the same generated list identifier.

> The most common bug here is mixing two different cache identities for the same screen. One generated list identifier should drive snapshot, optimistic update, rollback, and reconciliation.

## Why This Matters

Optimistic updates feel great only when the read contract and the write contract stay aligned. Generated helpers reduce the chance of subtle cache drift.

## Training Resources

- [Hey API - Get Started](https://heyapi.dev/openapi-ts/get-started)
