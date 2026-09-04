import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./swagger.yaml", // OpenAPI spec
  plugins: [
    ...defaultPlugins, // types.gen.ts + sdk.gen.ts
    {
      name: "@hey-api/sdk",
      // Name helpers from method + path (getApiV1BooksOptions) instead of the spec's
      // operationId (listBooksOptions). fakerestapi started shipping operationIds after
      // this workshop was written; without this flag a `npm run update-swagger-*` +
      // regenerate renames every helper and breaks all exercises and solutions.
      operationId: false,
    },
    "@hey-api/client-axios", // Axios-based client (client/ folder)
    "@tanstack/react-query", // TanStack Query hooks (@tanstack/ folder)
    "zod", // Zod schemas (zod.gen.ts)
  ],
  output: {
    path: "src/api/client",
    postProcess: [
      "oxlint",
      "oxfmt",
    ],
  }, // Output dir + formatting
});
