# Exercise 7: Why Hey API Wins

This is the adoption exercise. Your job is to inspect what Hey API generated and explain why a senior React team would choose it over hand-written API wrappers.

## Requirements

- Open `openapi-ts.config.ts` and identify the enabled plugins.
- Run `npm run openapi-ts` and inspect `src/api/client/`.
- Fill the generated artifact explorer with real files and the team value of each one:
  - SDK functions
  - TypeScript model/request/response types
  - TanStack Query options, mutation options, and query keys
  - Zod schemas
  - Axios client infrastructure
- Complete the decision matrix in the component. Keep the language practical, not marketing-heavy.
- In `swagger.yaml`, temporarily rename one model property or change a type, run `npm run openapi-ts`, and observe what TypeScript catches. Revert the spec change after the experiment.

> You should **never edit** files in `src/api/client/` directly. Edit the OpenAPI contract, regenerate, then let TypeScript point at the app code that must change.

## Discussion Prompt

If your team owns a REST backend already, what would be cheaper: migrating the backend to a new RPC/GraphQL stack, or tightening the OpenAPI contract and generating the frontend client?

## Why This Matters

Hey API is not just about fewer lines. It changes the failure mode from runtime drift to compile-time feedback, while still working with ordinary REST APIs.

## Training Resources

- [Hey API — Get Started](https://heyapi.dev/openapi-ts/get-started)
- [Hey API — Plugins](https://heyapi.dev/openapi-ts/plugins)
- [Hey API — TanStack Query Plugin](https://heyapi.dev/openapi-ts/plugins/tanstack-query)
- [Hey API — Zod Plugin](https://heyapi.dev/openapi-ts/plugins/zod)
