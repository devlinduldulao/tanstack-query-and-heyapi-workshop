export default function Exercise3End() {
  const generatedArtifacts = [
    {
      file: "src/api/client/sdk.gen.ts",
      purpose: "One typed function per OpenAPI operation.",
      teamValue: "Components stop owning URL strings, HTTP verbs, path params, and response wrappers.",
    },
    {
      file: "src/api/client/types.gen.ts",
      purpose: "Models plus request/response types generated from swagger.yaml.",
      teamValue: "DTOs change with the backend contract instead of drifting in app code.",
    },
    {
      file: "src/api/client/@tanstack/react-query.gen.ts",
      purpose: "Generated query options, query keys, and mutation options.",
      teamValue: "Reads, prefetches, invalidations, and optimistic writes share the same key source.",
    },
    {
      file: "src/api/client/zod.gen.ts",
      purpose: "Runtime schemas generated from the same contract as the TypeScript types.",
      teamValue: "Forms and edge payloads can be validated without retyping backend shapes.",
    },
    {
      file: "src/api/client/client.gen.ts",
      purpose: "Singleton Axios client configured once in app startup.",
      teamValue: "Base URL, auth headers, interceptors, and transport choices live outside feature UI.",
    },
  ];

  const decisionRows = [
    {
      concern: "API contract drift",
      manualAxios: "Usually discovered by QA or users after a backend response changes.",
      heyApi: "Regenerate and let TypeScript surface every incompatible usage.",
    },
    {
      concern: "TanStack Query keys",
      manualAxios: "Each team invents strings, so invalidation and prefetching often miss.",
      heyApi: "Generated keys come from the same operation as the query function.",
    },
    {
      concern: "Runtime validation",
      manualAxios: "Often skipped or duplicated by hand with partial schemas.",
      heyApi: "Zod schemas are generated beside the types and can be extended for UI rules.",
    },
  ];

  return (
    <div className="space-y-5 text-sm">
      <section>
        <h3 className="mb-2 font-semibold">Generated client artifacts</h3>
        <div className="space-y-2">
          {generatedArtifacts.map((artifact) => (
            <div key={artifact.file} className="rounded border p-3">
              <p className="font-mono text-xs">{artifact.file}</p>
              <p className="mt-1 text-xs">{artifact.purpose}</p>
              <p className="text-muted-foreground mt-1 text-xs">{artifact.teamValue}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">Decision matrix</h3>
        <div className="overflow-hidden rounded border text-xs">
          <div className="bg-muted grid grid-cols-3 font-medium">
            <span className="p-2">Concern</span>
            <span className="p-2">Manual axios</span>
            <span className="p-2">Hey API</span>
          </div>
          {decisionRows.map((row) => (
            <div key={row.concern} className="grid grid-cols-3 border-t">
              <span className="p-2 font-medium">{row.concern}</span>
              <span className="p-2">{row.manualAxios}</span>
              <span className="p-2">{row.heyApi}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
