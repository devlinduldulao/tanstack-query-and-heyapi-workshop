# Exercise 8: Replace Manual API Drift

The starter intentionally shows the kind of drift teams create under deadline pressure: a hand-written model, a string endpoint, and a manual read path. Your job is to delete that drift and move the screen onto generated contracts only.

## Requirements

- Delete the hand-written preview type from the starter.
- Replace the manual read path with the generated books helper already available in the client.
- Keep the UI focused on presentation, not request wiring.
- Add a small contract panel that shows:
  - endpoint path
  - the generated file that owns the API surface
  - what the UI code no longer owns

## Discussion Prompt

When the backend changes, what breaks first in a manual data layer: endpoint path, request shape, response shape, cache identity, or runtime behavior? Which of those does generation remove from the component?

## Why This Matters

This is the first adoption win: the UI stops owning endpoint strings and response models. The OpenAPI contract does.

## Training Resources

- [Hey API - Get Started](https://heyapi.dev/openapi-ts/get-started)
