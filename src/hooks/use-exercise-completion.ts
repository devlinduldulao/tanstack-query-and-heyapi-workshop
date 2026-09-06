import { useCallback, useSyncExternalStore } from "react";
import { createPersistedFlagMap } from "@/lib/persisted-flag-map";

const completionStore = createPersistedFlagMap("workshop-completed-exercises");

export function getCompletionKey(day: string, exercise: string) {
  return `${day}/${exercise}`;
}

export function useExerciseCompletion() {
  const completed = useSyncExternalStore(
    completionStore.subscribe,
    completionStore.read,
    completionStore.getServerSnapshot,
  );

  const isCompleted = useCallback(
    (day: string, exercise: string) => !!completed[getCompletionKey(day, exercise)],
    [completed],
  );

  const toggleCompletion = useCallback((day: string, exercise: string) => {
    completionStore.toggle(getCompletionKey(day, exercise));
  }, []);

  return { isCompleted, toggleCompletion, completed };
}
