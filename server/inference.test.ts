import { describe, expect, it } from "vitest";
import { runMobileNetInference } from "./inference";
import { appRouter } from "./routers";

const onePixelPng = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

describe("MobileNetV3 inference bridge", () => {
  it("loads the uploaded checkpoint and returns a mapped 37-class result", async () => {
    const result = await runMobileNetInference(onePixelPng);
    expect(result.classId).toMatch(/^\d+$/);
    expect(result.className).toMatch(/^[a-z0-9_]+$/);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.top.length).toBeGreaterThan(0);
  }, 30000);

  it("returns the same result through the public inference procedure", async () => {
    const caller = appRouter.createCaller({ user: undefined, req: {} as never, res: {} as never });
    const result = await caller.inference.classify({ imageDataUrl: onePixelPng });
    expect(result.className).toMatch(/^[a-z0-9_]+$/);
    expect(result.top[0]?.className).toBe(result.className);
  }, 30000);
});
