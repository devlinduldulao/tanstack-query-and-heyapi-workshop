import type { QueryClient } from "@tanstack/react-query";
import { MainNav } from "@/components/main-nav";
import { ThemeSwitcher } from "@/components/theme-switcher";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

type RouterContextType = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContextType>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Header */}
      <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          <MainNav />
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-background/80 mt-auto border-t py-6 backdrop-blur-sm">
        <div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
          <p className="font-display">
            Built with <span className="gradient-text font-semibold">TanStack Query</span> ×{" "}
            <span className="gradient-text font-semibold">HeyAPI</span> ×{" "}
            <span className="gradient-text font-semibold">React 19</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
