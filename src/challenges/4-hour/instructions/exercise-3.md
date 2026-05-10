# Exercise 3: Why Hey API Wins

This is the adoption exercise. Your job is to inspect what Hey API generated and explain why a senior React team would choose generated contracts over a hand-maintained API layer.

## Requirements

- Open `openapi-ts.config.ts` and identify the enabled generators.
- Run `npm run openapi-ts` and inspect `src/api/client/`.
- Fill the generated artifact explorer with real files and the team value of each one:
  - endpoint helpers
  - TypeScript model, request, and response types
  - generated read and write helpers for the UI layer
  - runtime support files that the generated client depends on
- Complete the decision matrix in the component. Keep the language practical, not marketing-heavy.
- In `swagger.yaml`, temporarily rename one model property or change a type, run `npm run openapi-ts`, and observe what TypeScript catches. Revert the spec change after the experiment.

> Never edit files in `src/api/client/` directly. Change the contract, regenerate, and let TypeScript show you the impacted app code.

## Discussion Prompt

If your team already owns a REST backend, what is cheaper: replacing the whole stack, or tightening the OpenAPI contract and regenerating the frontend surface?

## Why This Matters

Hey API changes the failure mode from silent runtime drift to visible compile-time feedback. That is the real productivity win.

## Training Resources

- [Hey API - Get Started](https://heyapi.dev/openapi-ts/get-started)
- [Hey API - Plugins](https://heyapi.dev/openapi-ts/plugins)
