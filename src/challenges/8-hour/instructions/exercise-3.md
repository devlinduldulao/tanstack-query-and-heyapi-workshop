# Exercise 3: Refresh UX on Top of Generated Reads

The generated read contract already handles the data source. This exercise is about the screen behavior around it: first render, friendly failure messaging, and subtle background refresh feedback.

## Requirements

- Keep the generated list contract as the only source of data.
- Show a full-screen loading treatment for the first render.
- Show a smaller refresh indicator when the screen is updating in the background.
- Render a friendly failure message when the read fails.
- Add a visible retry action.
- Add a user-triggered refresh action without replacing the whole screen with a blocking loading state.

> Good data UX is mostly about not confusing first load, retry, and background refresh. The contract stays the same; the presentation changes.

## Why This Matters

Most teams make refresh feel like a full reload. Clear state separation makes the app feel much faster even when the network did not change.

## Training Resources

- [Hey API - Get Started](https://heyapi.dev/openapi-ts/get-started)
