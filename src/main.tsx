import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import ReactDOM from "react-dom/client";
import { routeTree } from "./route-tree.gen";
import { client } from "./api/client/client.gen";
import { Toaster } from "./components/ui/sonner";

client.setConfig({
  baseURL: "https://fakerestapi.vercel.app",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // gcTime means garbage collection time and it is set to one day
      gcTime: 1000 * 60 * 60 * 24,
      // background fetch after one hour
      staleTime: 1000 * 60 * 60,
      // 3 total attempts (1 initial + 2 retries)
      retry: 2,
      // 0s -> 1s, 1s → 5s. Little resiliency 😁
      retryDelay: (attemptIndex) => {
        return Math.min(1000 * 5 ** attemptIndex, 10000);
      },
    },
  },
});

const router = createRouter({
  scrollRestoration: true,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // background fetch after 24 hours
  defaultGcTime: 1000 * 60 * 60 * 24 * 7,

  // Preloading by "intent" works by using hover and touch start events on <Link> components to preload the dependencies for the destination route.
  // gcTime means garbage collection time and it is set to one week
  defaultStaleTime: 1000 * 60 * 60 * 24,

  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router; // merge your router's exact types with exported hooks, components, and utilities.
  }
}

function InnerApp() {
  return <RouterProvider router={router} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <InnerApp />
        <Toaster richColors position="top-right" />
      </MotionConfig>
    </QueryClientProvider>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
