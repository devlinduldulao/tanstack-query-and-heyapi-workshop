# Exercise 4: Generated Create Contracts

Reads are only half the story. In this exercise you will create a new book through the generated write contract instead of building a manual POST flow.

## Requirements

- Build a small form with `title` and `description`.
- Use the generated create-book contract already referenced in the starter file.
- Submit a request body that matches the generated shape the API expects.
- Disable submit while the request is in flight.
- Show a success message when the request completes.
- Surface the request failure message when the write fails.

> The fake API may not persist forever, but the exercise still teaches the right structure: generated contract in, UI state out.

## Why This Matters

Write paths are where manual API layers get messy fastest. A generated contract keeps the endpoint, body shape, and response wiring consistent.

## Training Resources

- [Hey API - Plugins](https://heyapi.dev/openapi-ts/plugins)
