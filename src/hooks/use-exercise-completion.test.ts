import test from "node:test";
import assert from "node:assert/strict";
import { getCompletionKey, toggleCompletedMap } from "./use-exercise-completion";

test("getCompletionKey builds a stable day/exercise key", () => {
  assert.equal(getCompletionKey("4-hour", "exercise-7"), "4-hour/exercise-7");
});

test("toggleCompletedMap marks an incomplete exercise as complete", () => {
  const next = toggleCompletedMap({}, "8-hour", "exercise-14");

  assert.deepEqual(next, {
    "8-hour/exercise-14": true,
  });
});

test("toggleCompletedMap flips an existing completion flag and preserves other entries", () => {
  const current = {
    "4-hour/exercise-1": true,
    "8-hour/exercise-14": true,
  };

  const next = toggleCompletedMap(current, "8-hour", "exercise-14");

  assert.deepEqual(next, {
    "4-hour/exercise-1": true,
    "8-hour/exercise-14": false,
  });
});