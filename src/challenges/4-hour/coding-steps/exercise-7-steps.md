# Exercise 7 Walkthrough — Orders Operations Console

A step-by-step build of the capstone solution. Follow it top to bottom and your
file should match `src/challenges/4-hour/solutions/exercise-7-end.tsx` at each
checkpoint.

---

## Step 1 — Master list with `useSuspenseQuery` + `select`

The starter already wires up `getApiV1OrdersOptions()`. Add a `select` that maps
the raw `Order[]` into a thin `OrderRow` shape — only the columns the table
needs. Doing this in `select` keeps the table re-rendering cheap because
TanStack Query memoizes selector output by reference equality.

```tsx
const { data: orders } = useSuspenseQuery({
  ...getApiV1OrdersOptions(),
  select: (items: Order[]): OrderRow[] =>
    items.slice(0, 10).map((order, index) => ({
      id: order.id ?? index + 1,
      status: order.status ?? "pending",
      customerName:
        [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(" ") ||
        "Unknown customer",
      total: order.total ?? 0,
      currency: order.currency ?? "USD",
      orderDate: order.orderDate?.slice(0, 10) ?? "—",
    })),
});
```

**Why `select`?** It runs after the cache hands you data, so derivation lives in
one place. The component never sees the raw `Order[]`. If three other components
mounted the same query with their own selectors, each would get its own
memoized projection.

**Checkpoint:** click a row → `selectedId` updates → right panel shows the four
TODO cards.

---

## Step 2 — Extract `OrderDetailPanel`

Move the four-card grid out of `Exercise7` into its own component:

```tsx
function OrderDetailPanel({ orderId }: { orderId: number }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Order #{orderId}</h3>
      {/* sub-panels go here */}
    </div>
  );
}
```

This is purely a refactor, but it sets up Step 4's three independent Suspense
boundaries cleanly.

---

## Step 3 — `OrderHeaderPanel` (suspense + detail query)

```tsx
function OrderHeaderPanel({ orderId }: { orderId: number }) {
  const { data: order } = useSuspenseQuery(
    getApiV1OrdersByIdOptions({ path: { id: orderId } }),
  );
  return (
    <div>
      <p>#{order.id} · {order.customer?.firstName} {order.customer?.lastName}</p>
      <p>{order.customer?.email}</p>
    </div>
  );
}
```

Mount it from `OrderDetailPanel` inside `<Suspense fallback={...}>`. Because
the header has its own boundary, the items panel and the notes panel can keep
streaming when only the header is slow.

**Why `useSuspenseQuery` and not `useQuery`?** Suspense queries throw a promise
on first load, which the nearest `<Suspense>` catches. You never have to write
`if (isLoading) return <Spinner />` again — the boundary handles it
declaratively.

---

## Step 4 — Optimistic status update

This is the new pattern of the capstone. Add a status-pill row that PATCHes
the order, but **flip the cache before the request finishes**.

```tsx
const queryClient = useQueryClient();
const detailKey = getApiV1OrdersByIdQueryKey({ path: { id: orderId } });

const statusMutation = useMutation({
  ...patchApiV1OrdersByIdMutation(),
  onMutate: async (variables) => {
    // 1. Stop any in-flight refetch from clobbering our optimistic value.
    await queryClient.cancelQueries({ queryKey: detailKey });
    // 2. Snapshot current cache so we can roll back on error.
    const previous = queryClient.getQueryData<Order>(detailKey);
    // 3. Write the optimistic value.
    queryClient.setQueryData<Order>(detailKey, (current) =>
      current ? { ...current, status: variables.body.status } : current,
    );
    // 4. Return rollback context to onError / onSettled.
    return { previous };
  },
  onError: (_e, _v, ctx) => {
    if (ctx?.previous) queryClient.setQueryData(detailKey, ctx.previous);
  },
  onSettled: () => {
    void queryClient.invalidateQueries({ queryKey: detailKey });
    void queryClient.invalidateQueries({ queryKey: getApiV1OrdersQueryKey() });
  },
});
```

The status pill row calls:

```tsx
statusMutation.mutate({
  path: { id: orderId },
  body: { ...order, status }, // PATCH on this server expects the full Order body
});
```

**Why invalidate the master list too?** The list shows the same status badge.
Without that second invalidation, the row in the table would keep showing the
old status until the next manual refresh.

**Test it in the browser:** click a status pill — the badge changes
immediately. Throttle the network in devtools, then click again — it still
flips instantly, then either confirms or rolls back when the response lands.

---

## Step 5 — `OrderItemsPanel`

```tsx
function OrderItemsPanel({ orderId }: { orderId: number }) {
  const { data: items } = useSuspenseQuery({
    ...getApiV1OrdersByIdItemsOptions({ path: { id: orderId } }),
    select: (rows): OrderItem[] => rows as OrderItem[],
  });
  // render product × quantity × unit table
}
```

The cast in `select` is necessary because the OpenAPI schema for
`/api/v1/Orders/{id}/items` returns a loose `Array<{ [key: string]: unknown }>`.
Centralizing the assertion in `select` keeps the JSX strongly typed.

Mount it inside its own `<Suspense>`.

---

## Step 6 — `OrderNotesPanel` + add-note form

```tsx
function OrderNotesPanel({ orderId }: { orderId: number }) {
  const queryClient = useQueryClient();
  const notesKey = getApiV1OrdersByIdNotesQueryKey({ path: { id: orderId } });
  const { data: notes } = useSuspenseQuery({
    ...getApiV1OrdersByIdNotesOptions({ path: { id: orderId } }),
    select: (rows): OrderNote[] => rows as OrderNote[],
  });
  const [body, setBody] = useState("");

  const addNoteMutation = useMutation({
    ...postApiV1OrderNotesMutation(),
    onSuccess: () => {
      setBody("");
      void queryClient.invalidateQueries({ queryKey: notesKey });
    },
  });
  // render list + textarea + submit button
}
```

The add-note path uses the **classic invalidation pattern** instead of an
optimistic write, because the server stamps `id`, `createdAt`, and `author`
fields you cannot fabricate on the client. Compare and contrast: status PATCH
is optimistic because every field is client-known; note POST is reactive
because the server owns half the row.

Mount inside its own `<Suspense>`.

---

## Step 7 — Final assembly

`OrderDetailPanel` ends up like this:

```tsx
<Suspense fallback={<HeaderSkeleton />}>
  <OrderHeaderPanel orderId={orderId} />
</Suspense>
<div className="grid md:grid-cols-2 gap-3">
  <Suspense fallback={<ItemsSkeleton />}>
    <OrderItemsPanel orderId={orderId} />
  </Suspense>
  <Suspense fallback={<NotesSkeleton />}>
    <OrderNotesPanel orderId={orderId} />
  </Suspense>
</div>
```

Three sibling boundaries. Each panel streams in independently. None can block
the others.

---

## Verification checklist

Open devtools and confirm each:

- [ ] **Network waterfall** — clicking an order kicks off three GETs in parallel
  (header, items, notes), not in sequence.
- [ ] **Optimistic flip** — clicking a status pill changes the badge before
  the PATCH response returns. Throttle to 3G to make the gap visible.
- [ ] **Rollback** — temporarily change the PATCH URL in devtools' request
  blocker; the badge should snap back to the previous status.
- [ ] **Master/detail consistency** — after a status change, the row in the
  table on the left also reflects the new status (proves the master-list
  invalidation works).
- [ ] **Note POST** — submitting clears the textarea, the new note appears in
  the list after the response, and the response includes server-stamped
  `createdAt`.
- [ ] **No hand-written keys** — every `invalidateQueries` call uses a
  `get*QueryKey()` helper, never a raw array.
