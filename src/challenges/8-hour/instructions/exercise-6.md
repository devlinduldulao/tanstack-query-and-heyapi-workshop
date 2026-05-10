# Exercise 6: Delete Recovery with Generated Contracts

This lab focuses on a clean delete flow that uses generated contracts, refreshes the right list after success, and surfaces failures clearly.

## Requirements

- Use the generated delete-book contract.
- Use the generated books-list identifier for the post-delete refresh.
- In the success handler, refresh the same generated list identifier.
- In the error handler, show a failure toast.
- Do not add manual cache writes, snapshots, or rollback logic.

> The important habit here is consistency: one generated list identifier should back the visible read and the post-delete refresh.

## Why This Matters

Generated helpers keep delete flows simple. You do not need a second hand-managed cache path to give users good feedback.

## Training Resources

- [Hey API - Plugins](https://heyapi.dev/openapi-ts/plugins)
