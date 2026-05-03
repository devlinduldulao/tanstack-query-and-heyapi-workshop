import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BootcampSidebar } from "@/components/internal/bootcamp-sidebar";

export const Route = createFileRoute("/bootcamp")({
  component: BootcampLayout,
});

function BootcampLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-4rem)] w-full">
        <BootcampSidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
