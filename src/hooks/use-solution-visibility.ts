import { useCallback, useSyncExternalStore } from "react";
import { createPersistedFlagMap } from "@/lib/persisted-flag-map";

const solutionStore = createPersistedFlagMap("workshop-revealed-solutions");

export function getSolutionKey(day: string, exercise: string) {
  return `${day}/${exercise}`;
}

/** Remembers per exercise whether the solution is revealed, so a refresh keeps it. */
export function useSolutionVisibility(day: string, exercise: string) {
  const revealed = useSyncExternalStore(solutionStore.subscribe, solutionStore.read, solutionStore.getServerSnapshot);

  const showSolution = !!revealed[getSolutionKey(day, exercise)];

  const toggleSolution = useCallback(() => {
    solutionStore.toggle(getSolutionKey(day, exercise));
  }, [day, exercise]);

  return { showSolution, toggleSolution };
}
