import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./swagger.yaml", // OpenAPI spec
  plugins: [
    ...defaultPlugins, // types.gen.ts + sdk.gen.ts
    "@hey-api/client-axios", // Axios-based client (client/ folder)
    "@tanstack/react-query", // TanStack Query hooks (@tanstack/ folder)
    "zod", // Zod schemas (zod.gen.ts)
  ],
  output: {
    path: "src/api/client",
    postProcess: [
      {
        args: ["exec", "--", "oxlint", "--fix", "-c", ".oxlintrc.openapi.json", "{{path}}"],
        command: "npm",
        name: "Oxlint",
      },
      "oxfmt",
    ],
  }, // Output dir + formatting
});
