import type { QueryClient } from "@tanstack/react-query";
import { MainNav } from "@/components/main-nav";
import { ThemeSwitcher } from "@/components/theme-switcher";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";

type RouterContextType = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContextType>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="bg-primary/5 absolute -top-1/2 -right-1/2 h-full w-full rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="bg-primary/5 absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <MainNav className="mx-6" />
          <ThemeSwitcher />
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="flex-1 space-y-4 p-8 pt-6"
      >
        <Outlet />
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-background/80 mt-auto border-t py-6 backdrop-blur-sm"
      >
        <div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
          <p className="font-display">
            Built with <span className="gradient-text font-semibold">TanStack Query</span> ×{" "}
            <span className="gradient-text font-semibold">HeyAPI</span> ×{" "}
            <span className="gradient-text font-semibold">React 19</span>
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
