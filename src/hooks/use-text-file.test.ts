import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@/testing/test-utils";
import { useTextFile } from "./use-text-file";

describe("useTextFile", () => {
  it("loads plain text content from a path", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue("workshop notes"),
      }),
    );

    const { result } = renderHook(() => useTextFile("/guide.md"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current).toEqual({
        data: "workshop notes",
        error: null,
        loading: false,
      });
    });
  });

  it("surfaces a friendly error when the response is an html fallback page", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue("<!DOCTYPE html><html><body>missing</body></html>"),
      }),
    );

    const { result } = renderHook(() => useTextFile("/missing.md"));

    await waitFor(() => {
      expect(result.current).toEqual({
        data: null,
        error: "File not found: /missing.md",
        loading: false,
      });
    });
  });

  it("reports fetch failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const { result } = renderHook(() => useTextFile("/broken.md"));

    await waitFor(() => {
      expect(result.current).toEqual({
        data: null,
        error: "network down",
        loading: false,
      });
    });
  });
});