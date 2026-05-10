# Exercise 7: Contract Drift Drill

This is the closest exercise to real frontend platform work. The backend contract can move without waiting for the UI team, so your job is to sync the spec, regenerate the client, classify the drift, and then ship the next UI slice from the generated surface.

## Requirements

- Run `npm run update-swagger-bash` to pull the latest backend Swagger.
- Run `npm run openapi-ts` and inspect the generated output.
- Compare `swagger.yaml` and `src/api/client/` with `git diff -- swagger.yaml src/api/client`.
- Write down how the live sync added the new `CoverPhotos` resource to the generated frontend surface.
- Build a small cover explorer from the generated helpers:
  - list books with the generated books-list helper
  - mount the generated cover-by-book helper only after a book is selected
  - keep the list/detail flow free of manual URL strings and hand-written cache keys
- Fill the impact panel with practical observations, not vague statements.

> Real teams do this exact triage: sometimes a contract update is a no-op, and sometimes it creates a brand new surface area the UI can ship immediately. The point is to prove which case you are in before you plan the work.

## Discussion Prompt

When the backend adds a brand new resource like `CoverPhotos`, which parts of the UI should be reused from existing screens and which parts should come straight from the new generated contract?

## Why This Matters

Generated contracts do more than save typing. They let the frontend team turn a new backend capability into a shippable screen with less guesswork and fewer hand-built integration bugs.

## Training Resources

- [Hey API - Get Started](https://heyapi.dev/openapi-ts/get-started)
- [Hey API - Plugins](https://heyapi.dev/openapi-ts/plugins)