# Exercise 0 — Step-by-Step

> Goal: get the workshop running locally and prove your environment is ready before you write any code.
>
> There is no React code to write here. The starter component is already finished — your job is to operate the project, not edit the file. Treat this as a "first day on the job" warmup.

---

## Where to start

You are not editing [`exercise-0.tsx`](../exercise-0.tsx). You are confirming that the bootcamp app boots so that every later exercise has somewhere to render.

Open a terminal in the project root (the folder that has `package.json`) and follow the steps below in order.

---

## Step 1 — Verify your Node.js version

```bash
node -v
```

**Why this is first:** TanStack Router 1.x and Vite 8 require Node 20 or newer. If you skip this check and you are on Node 18, `npm install` will appear to work but later commands like `npm run dev` may crash with confusing module errors. Knowing the version up front saves an hour of debugging.

If the printed version is lower than `v20.0.0`, install Node 22+ (use `nvm`, `fnm`, or the official installer) **before** continuing.

---

## Step 2 — Install dependencies

```bash
npm install
```

**Why now:** the project depends on TanStack Query, Hey API, Zod, Tailwind, shadcn/ui, MSAL, and several dev tools. Running `npm install` once builds the `node_modules` folder and writes/refreshes `package-lock.json`. Until this completes, `npm run dev` and `npm run typecheck` cannot resolve imports.

**What to expect:** the first run downloads a lot. Subsequent runs are much faster because the cache is warm.

---

## Step 3 — Start the dev server

```bash
npm run dev
```

**Why now and not earlier:** Vite needs `node_modules` from Step 2 to pre-bundle imports. Starting it before installing would just fail.

You should see something like:

```
VITE v8.x  ready in xxx ms
➜ Local:   http://localhost:5173/
```

Leave this terminal running for the rest of the workshop. Open a **second** terminal for any other commands so you do not have to stop the dev server.

---

## Step 4 — Open the bootcamp UI in the browser

Open <http://localhost:5173> in Chrome, Edge, or Firefox.

**Why this is the verification gate:** if the page renders, then Vite, React 19, TanStack Router, and Tailwind are all wired up correctly. If you see a blank page or a 500 error, fix it now — every later exercise depends on the same pipeline.

---

## Step 5 — Navigate to the 4-hour exercise list

Use the left sidebar to open the **4-hour** track and click **Exercise 0**.

You should see the rocket emoji and the message _"Setup verified — open Exercise 1 to start fetching data."_

That message is rendered by [`exercise-0.tsx`](../exercise-0.tsx). The text is _not_ the goal — the goal is that React mounted the component without errors. Open the browser DevTools console and confirm there are no red errors.

---

## Step 6 — Practice the workshop loop

Every exercise uses the same three-file pattern. Get used to it now, on a file you do not have to change:

1. Open the **Task / Question** tab — that is the markdown in [`instructions/exercise-0.md`](../instructions/exercise-0.md). Always read this first.
2. Toggle **Show Solution** — that renders [`solutions/exercise-0-end.tsx`](../solutions/exercise-0-end.tsx). Use this only after you have tried the work yourself.
3. Click **Mark Complete** when you are done. Progress is saved in `localStorage`, so refreshing the browser does not lose it.

**Why this matters:** the rest of the workshop is fast. Knowing where each piece lives now means you spend Exercise 1 thinking about TanStack Query — not hunting for files.

---

## Step 7 — Optional but recommended sanity checks

Run these in your **second** terminal (do not stop the dev server):

```bash
npm run typecheck
npm run lint
```

**Why optional:** they are not required to pass Exercise 0. But if either command fails on a clean clone, something is wrong with your machine — and you want to know that now, not at Exercise 5 when you are mid-flow.

---

## Definition of done

- ✅ `node -v` prints v20 or higher.
- ✅ `npm install` finished without errors.
- ✅ `npm run dev` is running and the browser tab loads at `http://localhost:5173`.
- ✅ Exercise 0 renders in the bootcamp UI with no console errors.
- ✅ You can toggle **Show Solution** and click **Mark Complete**.

---

## Common first-time mistakes (and how to recognize them)

| Symptom                                                        | Likely cause                          | Fix                                                                      |
| -------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| `npm run dev` fails with `EACCES` or permission errors         | Running from a system-protected path  | Move the project into your user folder (e.g. `Documents/DEVELOPMENT`).   |
| Browser shows "Cannot GET /"                                   | Dev server not actually running       | Re-check Step 3; make sure you ran `npm run dev` after `npm install`.    |
| Page is blank and console says "Failed to resolve module ..."  | `node_modules` is incomplete          | Delete `node_modules` + `package-lock.json`, re-run `npm install`.       |
| TypeScript errors on a fresh clone                             | Wrong Node version or stale install   | Re-check Step 1, then redo Step 2.                                       |

Once everything passes, move on to Exercise 1 — that is where you actually start writing code.
