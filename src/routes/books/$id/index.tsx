import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/books/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/books/$id/"!</div>;
}
