// TODO: Build the Orders Operations Console completion.
//
// You have a paginated orders list rendering on the left. The right panel is empty until
// you select an order. Your job is to wire up these four moving pieces using ONLY the
// generated Hey API + TanStack Query helpers (no hand-written fetches):
//
//   1. Detail panel: mount three parallel queries when an order is selected
//      - getApiV1OrdersByIdOptions       -> header + status + customer
//      - getApiV1OrdersByIdItemsOptions  -> line items table
//      - getApiV1OrdersByIdNotesOptions  -> internal notes feed
//      Wrap each panel in its own <Suspense> so they stream in independently.
//
//   2. Optimistic status update: clicking a status pill should call
//      patchApiV1OrdersByIdMutation with onMutate/onError/onSettled so the badge
//      flips instantly and rolls back if the server rejects it.
//
//   3. Add-note form: postApiV1OrderNotesMutation with onSuccess invalidating
//      getApiV1OrdersByIdNotesQueryKey({ path: { id: selectedId } }).
//
//   4. Refresh the master list after a status change so the row badge stays in sync
//      (invalidate getApiV1OrdersQueryKey()).
//
// The reference solution lives in src/challenges/8-hour/solutions/exercise-14-end.tsx.

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1OrdersOptions } from "@/api/client/@tanstack/react-query.gen";
import type { Order } from "@/api/client";

const statusFlow = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

type OrderRow = {
  id: number;
  status: string;
  customerName: string;
  total: number;
  currency: string;
  orderDate: string;
};

function formatCurrency(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export default function Exercise14() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: orders } = useSuspenseQuery({
    ...getApiV1OrdersOptions(),
    select: (items: Order[]): OrderRow[] =>
      items.slice(0, 10).map((order, index) => ({
        id: order.id ?? index + 1,
        status: order.status ?? "pending",
        customerName:
          [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(" ") || "Unknown customer",
        total: order.total ?? 0,
        currency: order.currency ?? "USD",
        orderDate: order.orderDate?.slice(0, 10) ?? "—",
      })),
  });

  return (
    <div className="grid gap-4 text-sm lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <section className="rounded border p-3">
        <h3 className="mb-3 font-semibold">Orders queue</h3>
        <table className="w-full text-xs">
          <thead className="text-muted-foreground text-left">
            <tr>
              <th className="py-1">#</th>
              <th>Customer</th>
              <th>Status</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isSelected = order.id === selectedId;
              return (
                <tr
                  key={order.id}
                  onClick={() => setSelectedId(order.id)}
                  className={`hover:bg-muted cursor-pointer border-t ${isSelected ? "bg-muted" : ""}`}
                >
                  <td className="py-1 font-mono">#{order.id}</td>
                  <td>
                    <div>{order.customerName}</div>
                    <div className="text-muted-foreground">{order.orderDate}</div>
                  </td>
                  <td>
                    <span className="rounded border px-2 py-0.5 text-[10px] uppercase">{order.status}</span>
                  </td>
                  <td className="text-right font-mono">{formatCurrency(order.total, order.currency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="space-y-3 rounded border p-3">
        {selectedId === null ? (
          <p className="text-muted-foreground">Select an order on the left to load its detail panel.</p>
        ) : (
          <div className="space-y-3">
            <h3 className="font-semibold">Order #{selectedId}</h3>

            <div className="rounded border border-dashed p-3 text-xs">
              <p className="font-medium">TODO 1 — Order header</p>
              <p className="text-muted-foreground mt-1">
                Mount <code>getApiV1OrdersByIdOptions({"{ path: { id: selectedId } }"})</code> inside a child{" "}
                <code>&lt;Suspense&gt;</code>. Render customer email, shipping city, and the status pill row.
              </p>
            </div>

            <div className="rounded border border-dashed p-3 text-xs">
              <p className="font-medium">TODO 2 — Optimistic status update</p>
              <p className="text-muted-foreground mt-1">
                Wire the buttons below to <code>patchApiV1OrdersByIdMutation()</code> with <code>onMutate</code> /{" "}
                <code>onError</code> / <code>onSettled</code> so the new status appears instantly and rolls back on
                failure.
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {statusFlow.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled
                    className="rounded border px-2 py-1 text-[10px] uppercase opacity-50"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded border border-dashed p-3 text-xs">
                <p className="font-medium">TODO 3 — Line items</p>
                <p className="text-muted-foreground mt-1">
                  Mount <code>getApiV1OrdersByIdItemsOptions(...)</code> in its own <code>&lt;Suspense&gt;</code> and
                  render a small table of product name × quantity × unit price.
                </p>
              </div>
              <div className="rounded border border-dashed p-3 text-xs">
                <p className="font-medium">TODO 4 — Notes feed + add-note form</p>
                <p className="text-muted-foreground mt-1">
                  Mount <code>getApiV1OrdersByIdNotesOptions(...)</code> for the feed and{" "}
                  <code>postApiV1OrderNotesMutation()</code> for the form. Invalidate the notes query key on success.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
