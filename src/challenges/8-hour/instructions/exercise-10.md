# Exercise 10: Suspense-Ready Generated Reads

This lab is about using the project's suspense-ready data pattern so component bodies can assume data is present once they render.

## Requirements

- Keep the screen on the generated read contract already used in the starter.
- Let the surrounding loading and error boundaries own first-load and failure UI.
- Remove local branches that assume data might be missing after the component has rendered.
- Keep the component focused on rendering the resolved data.

> The goal is not a new request pattern. The goal is a simpler component body because the surrounding app already handles loading and failure states.

## Why This Matters

When the app shell owns loading and failure boundaries, feature components stay smaller and easier to reason about.

## Training Resources

- [Hey API - Get Started](https://heyapi.dev/openapi-ts/get-started)
