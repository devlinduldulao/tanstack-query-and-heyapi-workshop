import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/books")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
