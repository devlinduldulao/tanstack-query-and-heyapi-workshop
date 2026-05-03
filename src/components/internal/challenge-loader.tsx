import { type ComponentType, lazy, Suspense, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  day: string;
  exercise: string;
  showSolution: boolean;
};

export function ChallengeLoader({ day, exercise, showSolution }: Props) {
  const [Comp, setComp] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setComp(null);
    setError(null);

    const base = showSolution
      ? `../../challenges/${day}/solutions/${exercise}-end`
      : `../../challenges/${day}/${exercise}`;

    const tryExt = async (ext: string) => {
      const path = base + ext;
      const Lazy = lazy(() => import(/* @vite-ignore */ path));
      // Pre-resolve to confirm existence
      await import(/* @vite-ignore */ path);
      return Lazy;
    };

    (async () => {
      for (const ext of [".tsx", ".jsx"]) {
        try {
          const Lazy = await tryExt(ext);
          setComp(() => Lazy);
          return;
        } catch {
          // try next
        }
      }
      setError(`Component not found for ${day}/${exercise}`);
    })();
  }, [day, exercise, showSolution]);

  if (error) {
    return (
      <div className="py-8 text-center text-sm">
        <p className="mb-2 font-semibold">Challenge component not found</p>
        <p className="opacity-70">{error}</p>
      </div>
    );
  }

  if (!Comp) {
    return (
      <div className="py-8 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        const message = error instanceof Error ? error.message : String(error);

        return (
          <div className="py-6 text-sm">
            <p className="mb-2 font-semibold">Challenge error</p>
            <pre className="bg-muted overflow-auto rounded p-3 text-xs">{message}</pre>
            <button onClick={resetErrorBoundary} className="mt-3 rounded border px-3 py-1 text-xs">
              Try again
            </button>
          </div>
        );
      }}
    >
      <Suspense
        fallback={
          <div className="py-8 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          </div>
        }
      >
        <Comp />
      </Suspense>
    </ErrorBoundary>
  );
}
