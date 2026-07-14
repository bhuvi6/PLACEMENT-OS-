import { useCallback, useEffect, useState } from "react";

function readValue<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

/**
 * A useState-like hook that persists its value to localStorage and keeps
 * all hook instances of the same key in sync (including across tabs).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readValue(key, initialValue)
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next =
          value instanceof Function ? (value as (prev: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
          window.dispatchEvent(
            new CustomEvent("local-storage", { detail: { key } })
          );
        } catch (error) {
          console.error(`Error writing localStorage key "${key}":`, error);
        }
        return next;
      });
    },
    [key]
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string }>;
      if (customEvent.detail?.key === key || (e as StorageEvent).key === key) {
        setStoredValue(readValue(key, initialValue));
      }
    };
    window.addEventListener("storage", handler);
    window.addEventListener("local-storage", handler as EventListener);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("local-storage", handler as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue] as const;
}
