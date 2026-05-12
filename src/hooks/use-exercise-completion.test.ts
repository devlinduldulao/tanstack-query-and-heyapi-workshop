import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@/testing/test-utils";
import { getCompletionKey, toggleCompletedMap, useExerciseCompletion } from "./use-exercise-completion";

describe("useExerciseCompletion helpers", () => {
  beforeEach(() => {
    let storage = new Map<string, string>();

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        clear: () => {
          storage = new Map<string, string>();
        },
        getItem: (key: string) => storage.get(key) ?? null,
        key: (index: number) => Array.from(storage.keys())[index] ?? null,
        removeItem: (key: string) => {
          storage.delete(key);
        },
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
        get length() {
          return storage.size;
        },
      } satisfies Storage,
    });
  });

  it("builds a stable day and exercise key", () => {
    expect(getCompletionKey("4-hour", "exercise-7")).toBe("4-hour/exercise-7");
  });

  it("marks an incomplete exercise as complete", () => {
    const next = toggleCompletedMap({}, "8-hour", "exercise-14");

    expect(next).toEqual({
      "8-hour/exercise-14": true,
    });
  });

  it("flips an existing completion flag and preserves other entries", () => {
    const current = {
      "4-hour/exercise-1": true,
      "8-hour/exercise-14": true,
    };

    const next = toggleCompletedMap(current, "8-hour", "exercise-14");

    expect(next).toEqual({
      "4-hour/exercise-1": true,
      "8-hour/exercise-14": false,
    });
  });

  it("toggles completion state through the hook API", async () => {
    const { result } = renderHook(() => useExerciseCompletion());

    expect(result.current.isCompleted("4-hour", "exercise-2")).toBe(false);

    act(() => {
      result.current.toggleCompletion("4-hour", "exercise-2");
    });

    await waitFor(() => {
      expect(result.current.isCompleted("4-hour", "exercise-2")).toBe(true);
      expect(result.current.completed).toEqual({
        "4-hour/exercise-2": true,
      });
    });
  });
});