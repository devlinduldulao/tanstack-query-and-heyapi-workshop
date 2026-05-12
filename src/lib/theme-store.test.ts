import { beforeEach, describe, expect, it } from "vitest";
import { applyThemeToDocument, useThemeStore } from "./theme-store";

describe("theme-store", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "light" });
  });

  it("applies the dark theme class and dataset", () => {
    applyThemeToDocument("dark");

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("dim")).toBe(false);
  });

  it("applies the dim theme classes and dataset", () => {
    applyThemeToDocument("dim");

    expect(document.documentElement.dataset.theme).toBe("dim");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("dim")).toBe(true);
  });

  it("updates the store state when setTheme is called", () => {
    useThemeStore.getState().setTheme("dark");

    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});