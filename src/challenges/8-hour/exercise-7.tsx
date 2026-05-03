// TODO:
// 1. Replace the TODO rows with real generated artifacts from src/api/client/.
// 2. Complete the decision matrix in language you would use in an architecture review.
// 3. Run npm run openapi-ts after a temporary swagger.yaml change and observe the type errors.

type GeneratedArtifact = {
  file: string;
  purpose: string;
  teamValue: string;
};

type DecisionRow = {
  concern: string;
  manualAxios: string;
  heyApi: string;
};

const generatedArtifacts: GeneratedArtifact[] = [
  {
    file: "TODO: src/api/client/sdk.gen.ts",
    purpose: "TODO: generated endpoint functions",
    teamValue: "TODO: what this removes from app code",
  },
  {
    file: "TODO: src/api/client/@tanstack/react-query.gen.ts",
    purpose: "TODO",
    teamValue: "TODO",
  },
  {
    file: "TODO: src/api/client/zod.gen.ts",
    purpose: "TODO",
    teamValue: "TODO",
  },
];

const decisionRows: DecisionRow[] = [
  {
    concern: "API contract drift",
    manualAxios: "TODO",
    heyApi: "TODO",
  },
  {
    concern: "TanStack Query keys",
    manualAxios: "TODO",
    heyApi: "TODO",
  },
  {
    concern: "Runtime validation",
    manualAxios: "TODO",
    heyApi: "TODO",
  },
];

export default function Exercise7() {
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
