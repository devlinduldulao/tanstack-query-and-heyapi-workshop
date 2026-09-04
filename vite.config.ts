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
});
