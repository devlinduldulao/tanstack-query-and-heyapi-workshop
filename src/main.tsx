import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { routeTree } from "./route-tree.gen";
import { client } from "./api/client/client.gen";

client.setConfig({
  baseURL: "https://fakerestapi.azurewebsites.net",
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
  // background fetch after 24 hours
  defaultGcTime: 1000 * 60 * 60 * 24 * 7,

  // will preload the route when the user hovers over a link
  defaultPreload: "intent",

  // will preload the route when the user scrolls to it
  // defaultPreload: "viewport",

  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 1000 * 60 * 60 * 24,

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
      <InnerApp />
    </QueryClientProvider>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
