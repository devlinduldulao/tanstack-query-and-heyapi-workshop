# Exercise 4: Generated Screen Contracts

This exercise uses generated books helpers as the only source of truth for both the list and the detail panel. Your job is to add screen-level behavior without recreating request logic by hand.

## Requirements

- Use the generated books list helper for the primary screen data.
- Use the generated single-book helper for the detail panel.
- Render the detail panel only after a valid selection exists.
- Layer screen-specific behavior on top of the generated helpers:
  - transform only the fields the list actually needs
  - set a useful freshness window for the list
  - wire a targeted refresh action through the generated books-list identifier
- Do not introduce manual endpoint strings or hand-written cache identifiers.

## Discussion Prompt

When the backend adds a new required parameter, which approach fails earlier: generated contracts or hand-built request objects?

## Why This Matters

Generated read helpers are valuable because every screen uses the same contract surface. That keeps reads, refreshes, and future refactors consistent.

## Training Resources

- [Hey API - Plugins](https://heyapi.dev/openapi-ts/plugins)
