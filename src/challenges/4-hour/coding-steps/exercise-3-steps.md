# Exercise 3 — Step-by-Step

> Goal: convert a placeholder "decision matrix" component into a real architecture-review artifact by **reading the generated client** and filling in what each file does and why a team would adopt Hey API.

You are editing [`exercise-3.tsx`](../exercise-3.tsx). The reference output is [`solutions/exercise-3-end.tsx`](../solutions/exercise-3-end.tsx).

This exercise is **almost entirely a reading and writing exercise, not a coding exercise**. You will spend more time in `src/api/client/` and `openapi-ts.config.ts` than in your editor. That is intentional — junior devs often skip this step and pay for it later.

---

## Mental model first

Three things make Hey API worth adopting:

1. **One source of truth** — `swagger.yaml` describes the backend. Everything in `src/api/client/` is generated from it.
2. **Generators do the boring code** — sdk functions, types, query keys, mutation options, and Zod schemas all come for free, in sync with the spec.
3. **TypeScript catches drift at build time** — when the contract changes, regenerating surfaces breakage as red squiggles, not as production incidents.

Your job is to put those three points into your own words inside the component data structures. The arrays `generatedArtifacts` and `decisionRows` are rendered into cards and a table — you only change the **data**, not the JSX.

---

## Step 1 — Open the generated client folder

Before changing the component, you have to actually look at what was generated. In your editor, open:

- `src/api/client/sdk.gen.ts`
- `src/api/client/types.gen.ts`
- `src/api/client/@tanstack/react-query.gen.ts`
- `src/api/client/zod.gen.ts`
- `src/api/client/client.gen.ts`
- `src/api/client/index.ts` (the barrel)

**Why this is first:** you cannot honestly describe what these files give your team if you have never opened them. Skim each one — you do not need to understand every line, just the _shape_:

- `sdk.gen.ts` is **functions** (one per operation).
- `types.gen.ts` is **types** (DTOs and request/response shapes).
- `react-query.gen.ts` is **TanStack Query option builders** (`xxxOptions`, `xxxQueryKey`, `xxxMutation`).
- `zod.gen.ts` is **runtime schemas** (`zBook`, etc.).
- `client.gen.ts` is the configured **Axios client**.

---

## Step 2 — Open `openapi-ts.config.ts`

Look at which generators (plugins) are enabled. The config is the proof of _why_ each `*.gen.ts` file exists. If `@hey-api/typescript`, `@tanstack/react-query`, and `zod` are listed, that explains the three corresponding output files.

---

## Step 3 — Run the regeneration command once

```bash
npm run openapi-ts
```

**Why:** to internalize that these files are disposable. They are rebuilt every time the spec changes. **Never edit them by hand** — your edits will be wiped on the next run. This is the most important rule in the whole 4-hour track.

---

## Step 4 — Edit `generatedArtifacts` (top of `exercise-3.tsx`)

Find this array:

```tsx
const generatedArtifacts: GeneratedArtifact[] = [
  {
    file: "TODO: src/api/client/sdk.gen.ts",
    purpose: "TODO: generated endpoint functions",
    teamValue: "TODO: what this removes from app code",
  },
  // ...
];
```

Replace each TODO with the real description, then expand the array from three entries to five so it matches the solution. The solution file includes `sdk.gen.ts`, `types.gen.ts`, `@tanstack/react-query.gen.ts`, `zod.gen.ts`, and `client.gen.ts`.

Add the two missing entries yourself:

```tsx
{
  file: "src/api/client/types.gen.ts",
  purpose: "Models plus request/response types generated from swagger.yaml.",
  teamValue: "DTOs change with the backend contract instead of drifting in app code.",
},
{
  file: "src/api/client/client.gen.ts",
  purpose: "Singleton Axios client configured once in app startup.",
  teamValue: "Base URL, auth headers, interceptors, and transport choices live outside feature UI.",
},
```

The final array should cover endpoints, types, query helpers, runtime schemas, and the configured client.

**Why write these in your own words:** if you copy the solution verbatim, you are not internalizing why your team would adopt this. In an actual architecture review you will be asked "what does each generated file remove from app code?" Practice answering that now.

A good "team value" sentence is concrete: _"Components stop owning URL strings, HTTP verbs, and path params"_ is better than _"makes APIs easier"_.

---

## Step 5 — Edit `decisionRows`

Find:

```tsx
const decisionRows: DecisionRow[] = [
  { concern: "API contract drift", manualAxios: "TODO", heyApi: "TODO" },
  { concern: "TanStack Query keys", manualAxios: "TODO", heyApi: "TODO" },
  { concern: "Runtime validation", manualAxios: "TODO", heyApi: "TODO" },
];
```

For each row, write _what actually goes wrong_ on a manual-axios team and _what changes_ on a Hey API team. Be specific:

- **Contract drift** — manual: "discovered by QA after a release"; Hey API: "regenerate, get TypeScript errors".
- **Query keys** — manual: "every team invents strings, invalidations miss"; Hey API: "generated keys come from the same operation as the query function".
- **Runtime validation** — manual: "skipped or duplicated"; Hey API: "Zod schemas regenerate alongside types".

---

## Step 6 — Move the `generatedArtifacts` and `decisionRows` definitions

Look at how the **solution** is structured: both arrays live _inside_ the `Exercise3End` function. The starter has them at module scope. Either works — moving them inside the component matches the solution style and signals that this data is _component-local_, not shared. Make that change if you want a clean diff against the solution.

**Why this is a small but real teaching moment:** module-scope constants are computed once per module load. Component-scope constants are recomputed on every render, but the arrays are tiny and the readability win is worth it. Senior devs make this trade-off deliberately, not by accident.

---

## Step 7 — Confirm the JSX requires no changes

Both `<section>` blocks already iterate the arrays. You did not need to touch the JSX. Confirm that to yourself, then move on.

---

## Step 8 — Delete the `// TODO:` header

Remove the three-line TODO at the top of the file once every requirement is satisfied.

---

## Step 9 — The contract-drift experiment (do this last)

The instructions ask you to:

1. Edit `swagger.yaml` — pick a model and change a field's type or rename a property.
2. Run `npm run openapi-ts`.
3. Run `npm run typecheck`.
4. Observe which app files now have errors.
5. **Revert** `swagger.yaml` and regenerate.

**Why last:** doing this earlier risks leaving your repo in a half-broken state while you are still trying to edit the component. Do it after the component is done so you can focus on the actual lesson — "look how fast a contract change surfaces as a compile error".

---

## Code-change cheat sheet

| Section                        | Action                                          |
| ------------------------------ | ----------------------------------------------- |
| `generatedArtifacts` array     | Replace every `"TODO: ..."` and expand from 3 entries to 5 |
| `decisionRows` array           | Replace every `"TODO"` with a concrete sentence |
| Position of those arrays       | Optional: move inside `Exercise3` for clarity   |
| `// TODO:` header              | Delete once arrays are real                      |
| JSX                            | Do not change                                    |

---

## Common mistakes

- **Editing files in `src/api/client/`.** Never. Always change the spec and regenerate.
- **Writing vague "team value" sentences.** "Cleaner code" is not a reason. "Components stop owning URL strings" is.
- **Skipping Step 9.** The drift experiment is where the lesson actually lands. Do not skip it just because there is no test.
