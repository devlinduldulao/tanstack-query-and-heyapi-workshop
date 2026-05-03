import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/books/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
