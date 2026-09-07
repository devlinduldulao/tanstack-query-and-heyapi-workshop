# TanStack Query × Hey API — Senior React Workshops

> Two self-paced tracks for senior React developers who already know hooks, TypeScript, HTTP, and the basics of TanStack Query. The 8-hour workshop is the full curriculum. The 4-hour workshop is the compressed, highest-signal version.

## Quality Bar

Both tracks are designed around production judgment:

- Where should query keys, query options, and cache policy live?
- When do you invalidate, when do you update cache directly, and when do you do both?
- How do you keep writes simple with generated invalidation and clear toast feedback?
- What does Hey API remove from a React codebase that hand-written API layers usually get wrong?
- How do generated SDK functions, query options, mutation options, query keys, and Zod schemas work together?

Tutorial note: the workshop exercises intentionally avoid route prefetch so attendees learn the generated contracts first. The demo app pages still keep prefetch because that remains the preferred production pattern.

## 4-Hour Workshop

The 4-hour track lives under `src/challenges/4-hour/`. It keeps only the activities that give senior attendees the biggest practical return.

| Step | Activity                                   | Focus                                                                 |
| ---- | ------------------------------------------ | --------------------------------------------------------------------- |
| 0    | Setup                                      | Verify generator output, devtools, sidebar, completion tracking       |
| 1    | Query Options as a Contract                | Stable keys, abort signals, `select`, `staleTime`, `gcTime`           |
| 2    | Delete Feedback with Generated Contracts   | generated delete flows, success/error handlers, toast feedback        |
| 3    | Why Hey API Wins                           | Generated artifacts, trade-off matrix, spec-change workflow           |
| 4    | Generated Query Options as Query Factories | `*Options`, `*QueryKey`, `select`, generated detail queries           |
| 5    | Generated Mutations + Zod Validation       | `*Mutation`, generated keys, runtime schema validation                |
| 6    | Pagination, Search & Cache Shape           | derived local views, variable inputs, responsive filtering            |
| 7    | Contract Drift Drill                       | sync swagger, regenerate, triage impact, ship a new generated slice   |
| 8    | **Bug Challenge:** Cache Races             | Mismatched books-list key, optimistic cache lie, index-key races      |
| HW   | Compressed Completion                        | Apply the highest-impact patterns to one production slice             |

## 8-Hour Workshop

The 8-hour track lives under `src/challenges/8-hour/`. It keeps the full curriculum and adds more practice around state UX, mutation feedback, manual-to-generated migration, Suspense, and feature work. The surrounding demo app pages still model prefetch separately from the tutorial exercises.

### Part 1 · Advanced TanStack Query Patterns

| #   | Title                                    | Focus                                                            |
| --- | ---------------------------------------- | ---------------------------------------------------------------- |
| 0   | Workshop Setup                           | Verify generator output, devtools, sidebar, completion tracking  |
| 1   | Query Options as a Contract              | Stable keys, abort signals, `select`, `staleTime`, `gcTime`      |
| 2   | Parallel + Dependent Queries             | `enabled`, variable keys, master/detail, avoiding waterfalls     |
| 3   | State Machines, Retry & Refresh UX       | `isPending` vs `isFetching`, retry policy, non-janky refetching  |
| 4   | Mutation Lifecycle Design                | Pending/error surfaces and typed mutation payloads               |
| 5   | Smart Invalidation                       | Generated-style key discipline, targeted invalidation, cache set |
| 6   | Delete Recovery with Generated Contracts | generated delete flows, success/error handlers, toast feedback   |

### Part 2 · Hey API Adoption Lab

| #   | Title                                      | Focus                                                                   |
| --- | ------------------------------------------ | ----------------------------------------------------------------------- |
| 7   | Why Hey API Wins                           | Generated artifacts, trade-off matrix, spec-change workflow             |
| 8   | Replace Manual API Drift                   | Manual axios to generated SDK, response contracts, no hand-written DTOs |
| 9   | Generated Query Options as Query Factories | `*Options`, `*QueryKey`, `select`, dependent generated queries          |
| 10  | Suspense Boundaries                        | `useSuspenseQuery`, `<Suspense>`, `ErrorBoundary`, route ergonomics     |
| 11  | Generated Mutations + Zod Validation       | `*Mutation`, generated keys, runtime schema validation                  |

### Part 3 · Production Patterns + Challenges

| #   | Title                              | Focus                                                                    |
| --- | ---------------------------------- | ------------------------------------------------------------------------ |
| 12  | Warm Cache UX                      | generated detail contracts, cache freshness, and when app pages prefetch |
| 13  | Pagination, Search & Cache Shape   | derived local views, variable inputs, responsive filtering               |
| 14  | Contract Drift Drill               | sync swagger, regenerate, triage impact, ship a new generated slice      |
| C1  | **Feature Challenge:** Author CRUD | Generated helpers, create/edit/delete, toast feedback                    |
| C2  | **Bug Challenge:** Cache Races     | 4-hour bugs plus cancel/invalidate hitting authors (over-broad refresh)  |
| HW  | Completion Homework                  | Production-ready Books/Admin slice using every pattern from the track    |

## Why Hey API Is the Pitch

| Concern                             | Hand-written axios            | tRPC                  | GraphQL Codegen      | Hey API                       |
| ----------------------------------- | ----------------------------- | --------------------- | -------------------- | ----------------------------- |
| Works with existing REST APIs       | Yes, manually                 | Requires tRPC backend | Requires GraphQL API | Yes, from OpenAPI             |
| Request/response types stay in sync | Easy to drift                 | Strong                | Strong               | Generated from spec           |
| TanStack Query options/keys         | You maintain them             | Framework-specific    | Plugin-dependent     | Generated helpers             |
| Runtime validation                  | Usually skipped               | Possible              | Separate tooling     | Generated Zod schemas         |
| Backend coupling                    | Low but unsafe                | High                  | Medium/high          | Low and contract-driven       |
| Refactor signal on API change       | Runtime bugs or manual search | Compile-time          | Compile-time         | Compile-time + generated diff |

## How to Use

1. `npm install`
2. `npm run openapi-ts` (one-time, generates `src/api/client/`)
3. `npm run dev`
4. Open `http://localhost:5173/bootcamp`
5. Pick **4-hour workshop** or **8-hour workshop** from the menu.
6. Edit files under `src/challenges/4-hour/` or `src/challenges/8-hour/`. Hot reload reflects your changes immediately.
7. Toggle **Show Solution** when stuck. Click **Mark Complete** when done.
