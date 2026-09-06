export type FlagMap = Record<string, boolean>;

export type PersistedFlagMap = {
  read: () => FlagMap;
  toggle: (key: string) => void;
  subscribe: (onStoreChange: () => void) => () => void;
  getServerSnapshot: () => FlagMap;
};

const EMPTY: FlagMap = {};

/**
 * A boolean map kept in localStorage and shared by every component that reads
 * it, shaped for useSyncExternalStore.
 *
 * Never notify other components by dispatching a synthetic `storage` event:
 * listeners that mirror localStorage (TanStack Query Devtools installs one) read
 * the event's `newValue`, which is null on a hand-built StorageEvent, and delete
 * the key we just wrote. A private event sidesteps that entirely.
 */
export function createPersistedFlagMap(storageKey: string): PersistedFlagMap {
  const syncEvent = `${storageKey}:change`;

  // useSyncExternalStore needs a referentially stable snapshot, so cache the
  // parsed map and only re-parse when the raw string actually changes.
  let cachedRaw: string | null = null;
  let cachedMap: FlagMap = EMPTY;

  function read(): FlagMap {
    if (typeof window === "undefined") return EMPTY;

    let raw: string | null;
    try {
      raw = window.localStorage.getItem(storageKey);
    } catch {
      return EMPTY;
    }

    if (raw === cachedRaw) return cachedMap;

    cachedRaw = raw;
    try {
      cachedMap = raw ? (JSON.parse(raw) as FlagMap) : EMPTY;
    } catch {
      cachedMap = EMPTY;
    }
    return cachedMap;
  }

  function write(value: FlagMap) {
    if (typeof window === "undefined") return;

    const raw = JSON.stringify(value);
    try {
      window.localStorage.setItem(storageKey, raw);
    } catch {
      // Storage can be full or blocked; keep the in-memory value so the UI still updates.
    }

    cachedRaw = raw;
    cachedMap = value;
    window.dispatchEvent(new Event(syncEvent));
  }

  function toggle(key: string) {
    // Read fresh rather than closing over a snapshot, so two components or tabs
    // toggling in the same tick cannot clobber each other.
    const current = read();
    write({ ...current, [key]: !current[key] });
  }

  function subscribe(onStoreChange: () => void) {
    // A null key means another tab called localStorage.clear().
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === storageKey) onStoreChange();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(syncEvent, onStoreChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(syncEvent, onStoreChange);
    };
  }

  function getServerSnapshot(): FlagMap {
    return EMPTY;
  }

  return { read, toggle, subscribe, getServerSnapshot };
}
