import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges conditional class names", () => {
    const hiddenClass = undefined;

    expect(cn("rounded-md", hiddenClass, "px-2")).toBe("rounded-md px-2");
  });

  it("lets tailwind-merge resolve conflicting utility classes", () => {
    expect(cn("px-2 text-sm", "px-4", "text-lg")).toBe("px-4 text-lg");
  });
});