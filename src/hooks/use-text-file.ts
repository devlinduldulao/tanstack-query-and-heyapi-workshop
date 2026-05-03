import { useEffect, useState } from "react";

type State = {
  data: string | null;
  error: string | null;
  loading: boolean;
};

export function useTextFile(filePath: string): State {
  const [state, setState] = useState<State>({
    data: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    if (!filePath) return;
    let cancelled = false;
    setState({ data: null, error: null, loading: true });

    fetch(filePath)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (text.includes("<!DOCTYPE html>") || text.includes("<html")) throw new Error(`File not found: ${filePath}`);
        return text;
      })
      .then((text) => {
        if (!cancelled) setState({ data: text, error: null, loading: false });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ data: null, error: err.message, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [filePath]);

  return state;
}
