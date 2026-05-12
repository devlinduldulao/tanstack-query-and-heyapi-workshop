import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  window.localStorage?.clear();
  document.documentElement.dataset.theme = "";
  document.documentElement.className = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});