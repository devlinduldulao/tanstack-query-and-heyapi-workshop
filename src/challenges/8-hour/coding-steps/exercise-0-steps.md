# Exercise 0 — Step-by-Step

> Goal: get the workshop running locally and prove your environment is ready before you write any code.

There is no React code to write in this exercise. The starter component is already complete — your job is to **operate** the project, not edit the file. Treat this as your "first day on the job" warmup.

You are not editing [`exercise-0.tsx`](../exercise-0.tsx). You are confirming the bootcamp app boots so every later exercise has somewhere to render.

Open a terminal in the project root (the folder that has `package.json`) and follow the steps below in order.

---

## Step 1 — Verify your Node.js version

```bash
node -v
```

**Why this is first:** TanStack Router 1.x and Vite 8 require Node 20+. If you skip this check and you are on Node 18, `npm install` will appear to work but later commands may crash with confusing module errors. Knowing the version up front saves an hour of debugging.

If the printed version is lower than `v20.0.0`, install Node 20+ (use `nvm`, `fnm`, or the official installer) **before** continuing.

---

## Step 2 — Install dependencies

```bash
npm install
```

**Why now:** the project depends on TanStack Query, Hey API, Zod, Tailwind, shadcn/ui, MSAL, and several dev tools. `npm install` builds `node_modules` and refreshes `package-lock.json`. Until it completes, `npm run dev` and `npm run typecheck` cannot resolve imports.

The first run downloads a lot. Subsequent runs are much faster.

---

## Step 3 — Start the dev server

```bash
npm run dev
```

**Why now, not earlier:** Vite needs `node_modules` from Step 2 to pre-bundle imports. Starting it before installing would just fail.

You should see:

```
VITE v8.x  ready in xxx ms
➜ Local:   http://localhost:5173/
```

Leave this terminal running. Open a **second** terminal for any other commands so you do not have to stop the dev server.

---

## Step 4 — Open the bootcamp UI in the browser

Open <http://localhost:5173> in Chrome, Edge, or Firefox.

**Why this is the verification gate:** if the page renders, then Vite, React 19, TanStack Router, and Tailwind are all wired up correctly. If you see a blank page or a 500 error, fix it now — every later exercise depends on the same pipeline.

---

## Step 5 — Navigate to the 8-hour exercise list

Use the left sidebar to open the **8-hour** track and click **Exercise 0**.

You should see the rocket emoji and the message _"Setup verified — open Exercise 1 to start fetching data."_

Open DevTools console and confirm there are no red errors. The text itself is not the goal — the goal is that React mounted the component cleanly.

---

## Step 6 — Practice the workshop loop

Every exercise uses the same three-file pattern. Get used to it now, on a file you do not have to change:

1. Open the **Task / Question** tab — that is the markdown in [`instructions/exercise-0.md`](../instructions/exercise-0.md). Always read this first.
2. Toggle **Show Solution** — that renders [`solutions/exercise-0-end.tsx`](../solutions/exercise-0-end.tsx). Use this only after you have tried the work yourself.
3. Click **Mark Complete** when you finish. Progress is saved in `localStorage`.

The 8-hour track has 15 exercises and two end-of-day challenges. Knowing where each piece lives now means you spend later exercises thinking about the concepts — not hunting for files.

---

## Step 7 — Optional but recommended sanity checks

In your **second** terminal:

```bash
npm run typecheck
npm run lint
```

Both should pass on a clean clone. If either fails, something is wrong with your machine — and you want to find that out now, not at Exercise 7 when you are mid-flow.

---

## Definition of done

- ✅ `node -v` prints v20 or higher.
- ✅ `npm install` finished without errors.
- ✅ `npm run dev` is running and the browser tab loads at `http://localhost:5173`.
- ✅ Exercise 0 renders in the bootcamp UI with no console errors.
- ✅ You can toggle **Show Solution** and click **Mark Complete**.

---

## Common first-time mistakes

| Symptom                                                       | Likely cause                          | Fix                                                                      |
| ------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| `npm run dev` fails with `EACCES` errors                      | Running from a protected system path  | Move the project into your user folder (e.g. `Documents/DEVELOPMENT`).   |
| Browser shows "Cannot GET /"                                  | Dev server not actually running       | Re-check Step 3.                                                          |
| Page is blank and console says "Failed to resolve module ..." | `node_modules` is incomplete          | Delete `node_modules` + `package-lock.json`, re-run `npm install`.       |
| TypeScript errors on a fresh clone                            | Wrong Node version or stale install   | Re-check Step 1, then redo Step 2.                                       |

Once everything passes, move to Exercise 1 — that is where you start writing code.
