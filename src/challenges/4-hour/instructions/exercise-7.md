# Exercise 7: Orders Operations Console (Capstone)

This is the workshop finale. You combine everything from earlier exercises — generated query options, suspense boundaries, mutations, query invalidation, derived state — into one realistic admin screen, then add the one new advanced pattern: **optimistic updates with rollback**.

You ship an "Orders Operations Console" that an ops team would actually use:

- a master orders list on the left
- a detail panel on the right that streams in three independent sub-resources
- an inline status workflow with optimistic UI
- an internal-notes feed with an add-note form

All API calls go through generated Hey API + TanStack Query helpers — no hand-written `fetch`, no hand-written query keys.

## Step 0 — Sync the contract (the drift drill)

The repo ships in a **deliberately drifted** state. The local `swagger.yaml` is missing four endpoints that the live backend actually exposes:

- `GET /api/v1/Orders/{id}` (and PUT/PATCH/DELETE on the same path)
- `GET /api/v1/Orders/{id}/items`
- `GET /api/v1/Orders/{id}/notes`
- `POST /api/v1/OrderNotes`

That means the generated client at `src/api/client/` does **not** export the helpers your solution needs. Open `src/challenges/4-hour/solutions/exercise-7-end.tsx` right now — TypeScript will scream about ~20 errors. The starter on the other hand only uses `getApiV1OrdersOptions` and compiles fine.

Real teams hit this every sprint: backend ships a new endpoint, frontend has to (a) notice, (b) refetch the spec, (c) regenerate, (d) rebuild around the new surface. Walk that workflow now:

```bash
pnpm run update-swagger-bash   # curl the live swagger.yaml from fakerestapi.vercel.app
pnpm run openapi-ts            # regenerate src/api/client/ from the refreshed spec
git diff -- swagger.yaml src/api/client   # inspect what came back
pnpm run typecheck             # solution should compile now
```

After regen, the four helpers below appear in `src/api/client/@tanstack/react-query.gen.ts` and the solution typechecks. **Do not** silence the errors with `// @ts-expect-error` or by commenting out imports — that defeats the drill. The whole point is to feel the workflow.

## Starter

Open `src/challenges/4-hour/exercise-7.tsx`. You already have:

- `useSuspenseQuery(getApiV1OrdersOptions(...))` rendering 10 orders in a table.
- A row click sets `selectedId`.
- The right panel shows four labelled "TODO" cards for the work you must do.

The reference solution lives at `src/challenges/4-hour/solutions/exercise-7-end.tsx`.

## Requirements

### 1. Detail header — `getApiV1OrdersByIdOptions`

When `selectedId !== null`, mount a child component that calls:

```ts
useSuspenseQuery(getApiV1OrdersByIdOptions({ path: { id: selectedId } }));
```

Render the customer name + email and the shipping city. This component lives **inside its own `<Suspense>`** so the rest of the panel does not block on it.

### 2. Optimistic status update — `patchApiV1OrdersByIdMutation`

The status pill row (`pending → processing → shipped → delivered → cancelled`) must PATCH the order with the new status. Use the **optimistic update pattern**:

```ts
const detailKey = getApiV1OrdersByIdQueryKey({ path: { id: orderId } });

const statusMutation = useMutation({
  ...patchApiV1OrdersByIdMutation(),
  onMutate: async (variables) => {
    await queryClient.cancelQueries({ queryKey: detailKey });
    const previous = queryClient.getQueryData<Order>(detailKey);
    queryClient.setQueryData<Order>(detailKey, (current) =>
      current ? { ...current, status: variables.body.status } : current,
    );
    return { previous };
  },
  onError: (_e, _v, context) => {
    if (context?.previous) queryClient.setQueryData(detailKey, context.previous);
  },
  onSettled: () => {
    void queryClient.invalidateQueries({ queryKey: detailKey });
    void queryClient.invalidateQueries({ queryKey: getApiV1OrdersQueryKey() });
  },
});
```

Key ideas:

- **Cancel first.** An in-flight refetch could overwrite your optimistic value; `cancelQueries` stops it.
- **Snapshot before write.** `getQueryData` gives you the rollback target.
- **Return context from `onMutate`.** TanStack Query passes it to `onError` and `onSettled` automatically.
- **Reconcile in `onSettled`.** Invalidate both the detail key and the master list so the row badge stays accurate.

### 3. Line items panel — `getApiV1OrdersByIdItemsOptions`

Mount inside its own `<Suspense>`. Render a small table (`product × quantity × unit price`). The sub-resource response is loosely typed, so cast through `select`:

```ts
const { data: items } = useSuspenseQuery({
  ...getApiV1OrdersByIdItemsOptions({ path: { id: orderId } }),
  select: (rows): OrderItem[] => rows as OrderItem[],
});
```

### 4. Notes feed + add-note form — `getApiV1OrdersByIdNotesOptions` + `postApiV1OrderNotesMutation`

- Render the most recent 5 notes.
- An add-note form posts via `postApiV1OrderNotesMutation()` with body `{ orderId, body, authorId }`.
- On success, clear the textarea and invalidate the notes query key:

```ts
void queryClient.invalidateQueries({
  queryKey: getApiV1OrdersByIdNotesQueryKey({ path: { id: orderId } }),
});
```

## Why Three Independent `<Suspense>` Boundaries?

If you wrapped everything in one boundary, the slowest sub-resource would block the whole panel. Three sibling boundaries let each panel suspend in isolation, so users see header → items → notes stream in independently. This is the same pattern Next.js App Router teaches with nested `loading.tsx` files, applied at the component level.

## Why Optimistic Updates Are the Capstone Concept

Earlier exercises invalidate the cache after a mutation succeeds — the user waits for the round-trip before the UI reflects their action. That is fine for create/delete but feels sluggish for high-frequency edits like status changes.

Optimistic updates flip the script: write to the cache **first**, send to the server **second**, undo if the server says no. The four-callback shape (`onMutate`, `onError`, `onSettled`, plus the implicit success) is the standard TanStack Query recipe for it.

## Discussion Prompts

- Why do we cancel queries in `onMutate` before writing the optimistic value? What happens if you skip that step?
- Why invalidate both `getApiV1OrdersByIdQueryKey(...)` and `getApiV1OrdersQueryKey()` after a status change?
- How would you extend this screen to also update the matching row in the master list optimistically (not just the detail)?

## Why This Matters

Real ops dashboards live or die on perceived latency. A status change that flips instantly feels like a good product; one that spinners for 800ms feels broken. The generated client gives you typed mutation handles; TanStack Query gives you the cache surgery primitives. Together they make optimistic UI a 20-line pattern instead of a custom state machine.

## Training Resources

- [TanStack Query — Optimistic updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [TanStack Query — `useMutation` callbacks](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)
- [Hey API — `@tanstack/react-query` plugin](https://heyapi.dev/openapi-ts/plugins/tanstack-react-query)
- [React — `<Suspense>` boundaries](https://react.dev/reference/react/Suspense)
