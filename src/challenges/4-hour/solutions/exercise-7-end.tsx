// Reference solution — Orders Operations Console capstone.
//
// Patterns demonstrated:
//   * Master / detail with one selectedId state.
//   * Three parallel sub-resource queries (order, items, notes), each behind its own
//     <Suspense> so the panels stream in independently.
//   * Optimistic mutation: status PATCH updates the detail-cache snapshot immediately
//     in onMutate, rolls back via setQueryData in onError, and reconciles in onSettled.
//   * Mutation form: add-note POST with onSuccess invalidation of the notes query key.

import { Suspense, useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery, type QueryKey } from "@tanstack/react-query";
import {
  getApiV1OrdersByIdItemsOptions,
  getApiV1OrdersByIdNotesOptions,
  getApiV1OrdersByIdNotesQueryKey,
  getApiV1OrdersByIdOptions,
  getApiV1OrdersByIdQueryKey,
  getApiV1OrdersOptions,
  getApiV1OrdersQueryKey,
  patchApiV1OrdersByIdMutation,
  postApiV1OrderNotesMutation,
} from "@/api/client/@tanstack/react-query.gen";
import type { Order, OrderItem, OrderNote } from "@/api/client";

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

// ---------- Header panel: order summary + optimistic status update ----------

function OrderHeaderPanel({ orderId }: { orderId: number }) {
  const queryClient = useQueryClient();
  const detailKey = getApiV1OrdersByIdQueryKey({ path: { id: orderId } });
  const { data: order } = useSuspenseQuery(getApiV1OrdersByIdOptions({ path: { id: orderId } }));

  const statusMutation = useMutation({
    ...patchApiV1OrdersByIdMutation(),
    // Optimistic update: snapshot the cache, write the new status, roll back on error.
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: detailKey });
      const previous = queryClient.getQueryData<Order>(detailKey);
      queryClient.setQueryData<Order>(detailKey, (current) =>
        current ? { ...current, status: variables.body.status } : current,
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(detailKey, context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: detailKey });
      // Master list shows the badge too, keep it in sync.
      void queryClient.invalidateQueries({ queryKey: getApiV1OrdersQueryKey() });
    },
  });

  const customerName =
    [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(" ") || "Unknown customer";
  const shipping = [order.shippingAddress?.city, order.shippingAddress?.country].filter(Boolean).join(", ");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-semibold">
            #{order.id} · {customerName}
          </p>
          <p className="text-muted-foreground text-xs">
            {order.customer?.email ?? "no email"} · ships to {shipping || "—"}
          </p>
        </div>
        <p className="font-mono text-sm">{formatCurrency(order.total ?? 0, order.currency ?? "USD")}</p>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <span className="text-muted-foreground text-xs">Status:</span>
        {statusFlow.map((status) => {
          const isCurrent = order.status === status;
          return (
            <button
              key={status}
              type="button"
              disabled={isCurrent || statusMutation.isPending}
              onClick={() =>
                statusMutation.mutate({
                  path: { id: orderId },
                  body: { ...order, status },
                })
              }
              className={`rounded border px-2 py-1 text-[10px] uppercase ${
                isCurrent ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {status}
            </button>
          );
        })}
        {statusMutation.isError ? (
          <span className="text-destructive text-xs">Rolled back: {statusMutation.error.message}</span>
        ) : null}
      </div>
    </div>
  );
}

// ---------- Sub-resource: line items ----------

function OrderItemsPanel({ orderId }: { orderId: number }) {
  const { data: items } = useSuspenseQuery({
    ...getApiV1OrdersByIdItemsOptions({ path: { id: orderId } }),
    select: (rows): OrderItem[] => rows as OrderItem[],
  });

  if (items.length === 0) {
    return <p className="text-muted-foreground text-xs">No line items.</p>;
  }

  return (
    <table className="w-full text-xs">
      <thead className="text-muted-foreground text-left">
        <tr>
          <th className="py-1">Product</th>
          <th className="text-right">Qty</th>
          <th className="text-right">Unit</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={item.id ?? index} className="border-t">
            <td className="py-1">
              <div className="font-medium">Product #{item.productId ?? "?"}</div>
              {item.discount ? (
                <div className="text-muted-foreground">−{formatCurrency(item.discount, "USD")} discount</div>
              ) : null}
            </td>
            <td className="text-right font-mono">{item.quantity ?? 0}</td>
            <td className="text-right font-mono">{formatCurrency(item.unitPrice ?? 0, "USD")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---------- Sub-resource: notes feed + add-note form ----------

function OrderNotesPanel({ orderId }: { orderId: number }) {
  const queryClient = useQueryClient();
  const notesKey: QueryKey = getApiV1OrdersByIdNotesQueryKey({ path: { id: orderId } });
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

  return (
    <div className="space-y-2">
      {notes.length === 0 ? (
        <p className="text-muted-foreground text-xs">No notes yet.</p>
      ) : (
        <ul className="space-y-1">
          {notes.slice(0, 5).map((note, index) => (
            <li key={note.id ?? index} className="rounded border px-2 py-1 text-xs">
              <p>{note.body}</p>
              <p className="text-muted-foreground mt-0.5">
                {note.author?.userName ?? "system"} · {note.createdAt?.slice(0, 10) ?? ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form
        className="space-y-1"
        onSubmit={(event) => {
          event.preventDefault();
          if (!body.trim()) return;
          addNoteMutation.mutate({
            body: { orderId, body, authorId: 1 },
          });
        }}
      >
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={2}
          placeholder="Add internal note..."
          className="bg-background w-full rounded border px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={addNoteMutation.isPending || !body.trim()}
          className="bg-primary text-primary-foreground w-full rounded px-2 py-1 text-xs"
        >
          {addNoteMutation.isPending ? "Posting..." : "Post note"}
        </button>
      </form>
    </div>
  );
}

// ---------- Detail panel: composes the three sub-panels with independent Suspense ----------

function OrderDetailPanel({ orderId }: { orderId: number }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Order #{orderId}</h3>

      <Suspense fallback={<p className="text-muted-foreground text-xs">Loading order header...</p>}>
        <OrderHeaderPanel orderId={orderId} />
      </Suspense>

      <div className="grid gap-3 md:grid-cols-2">
        <section className="rounded border p-3">
          <p className="mb-2 text-xs font-medium">Line items</p>
          <Suspense fallback={<p className="text-muted-foreground text-xs">Loading items...</p>}>
            <OrderItemsPanel orderId={orderId} />
          </Suspense>
        </section>

        <section className="rounded border p-3">
          <p className="mb-2 text-xs font-medium">Internal notes</p>
          <Suspense fallback={<p className="text-muted-foreground text-xs">Loading notes...</p>}>
            <OrderNotesPanel orderId={orderId} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

// ---------- Master list ----------

export default function Exercise7End() {
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
          <OrderDetailPanel orderId={selectedId} />
        )}
      </section>
    </div>
  );
}
