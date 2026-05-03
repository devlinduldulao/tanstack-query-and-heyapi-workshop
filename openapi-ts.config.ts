import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./swagger.yaml", // OpenAPI spec
  plugins: [
    ...defaultPlugins, // types.gen.ts + sdk.gen.ts
    "@hey-api/client-axios", // Axios-based client (client/ folder)
    "@tanstack/react-query", // TanStack Query hooks (@tanstack/ folder)
    "zod", // Zod schemas (zod.gen.ts)
  ],
  output: { postProcess: ["oxlint", "oxfmt"], path: "src/api/client" }, // Output dir + formatting
});
