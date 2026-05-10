import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "workshop-completed-exercises";

type CompletedMap = Record<string, boolean>;

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

  const isCompleted = useCallback((day: string, exercise: string) => !!completed[`${day}/${exercise}`], [completed]);

  const toggleCompletion = useCallback(
    (day: string, exercise: string) => {
      const key = `${day}/${exercise}`;
      const next = { ...completed, [key]: !completed[key] };

      setCompleted(next);
      write(next);
    },
    [completed],
  );

  return { isCompleted, toggleCompletion, completed };
}
