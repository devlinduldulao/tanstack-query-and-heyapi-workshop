import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "workshop-completed-exercises";

type CompletedMap = Record<string, boolean>;

export function getCompletionKey(day: string, exercise: string) {
  return `${day}/${exercise}`;
}

export function toggleCompletedMap(completed: CompletedMap, day: string, exercise: string): CompletedMap {
  const key = getCompletionKey(day, exercise);
  return { ...completed, [key]: !completed[key] };
}

function read(): CompletedMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as CompletedMap;
  } catch {
    return {};
  }
}

function write(value: CompletedMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

export function useExerciseCompletion() {
  const [completed, setCompleted] = useState<CompletedMap>(() => read());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setCompleted(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isCompleted = useCallback((day: string, exercise: string) => !!completed[getCompletionKey(day, exercise)], [completed]);

  const toggleCompletion = useCallback(
    (day: string, exercise: string) => {
      const next = toggleCompletedMap(completed, day, exercise);

      setCompleted(next);
      write(next);
    },
    [completed],
  );

  return { isCompleted, toggleCompletion, completed };
}
