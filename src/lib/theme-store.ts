import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Theme = "light" | "dark" | "dim";

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const themeStorageKey = "ui-theme";

const fallbackStorage: Storage = {
  length: 0,
  clear() {},
  getItem() {
    return null;
  },
  key() {
    return null;
  },
  removeItem() {},
  setItem() {},
};

const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark" || value === "dim";

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  const dataTheme = document.documentElement.dataset.theme;
  if (isTheme(dataTheme)) {
    return dataTheme;
  }

  const storedTheme = getStorage()?.getItem(themeStorageKey);
  if (isTheme(storedTheme)) {
    return storedTheme;
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export const applyThemeToDocument = (theme: Theme) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.remove("dark", "dim");

  if (theme === "dark") {
    root.classList.add("dark");
  }

  if (theme === "dim") {
    root.classList.add("dark", "dim");
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    immer((set) => ({
      theme: getInitialTheme(),
      setTheme: (theme) => {
        set((state) => {
          state.theme = theme;
        });
        applyThemeToDocument(theme);
      },
    })),
    {
      name: themeStorageKey,
      storage: createJSONStorage(() => getStorage() ?? fallbackStorage),
      partialize: (state) => ({ theme: state.theme }),
      version: 1,
    },
  ),
);
