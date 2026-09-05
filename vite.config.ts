import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      routeTreeFileHeader: ["/* eslint-disable eslint-comments/no-unlimited-disable */", "/* eslint-disable */"],
      generatedRouteTree: "./src/route-tree.gen.ts",
    }),
    viteReact(),
    babel({
      presets: [reactCompilerPreset()]
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://fakerestapi.vercel.app",
        changeOrigin: true,
        // Zscaler cookie-auth 307s Chrome User-Agent traffic for OPTIONS /
        // DELETE. The proxy is a Node hop, so send a non-browser UA.
        headers: {
          "User-Agent": "DaloyWorkshopProxy/1.0",
        },
      },
    },
  },
});
