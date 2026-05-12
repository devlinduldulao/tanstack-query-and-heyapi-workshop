import { describe, expect, it } from "vitest";
import { renderHook, waitFor, mockMatchMedia, act } from "@/testing/test-utils";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
  it("returns true when the viewport starts below the mobile breakpoint", async () => {
    mockMatchMedia(true);
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 767,
    });

    const { result } = renderHook(() => useIsMobile());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("updates when the media query change event fires", async () => {
    const media = mockMatchMedia(false);
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });

    act(() => {
      window.innerWidth = 600;
      media.setMatches(true);
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});