import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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

  it("rejects malformed image data with a useful error instead of invoking a subprocess", async () => {
    await expect(runMobileNetInference("data:text/plain;base64,SGVsbG8=")).rejects.toThrow("Only JPEG, PNG, and WebP image data is supported.");
  });

  it("keeps Python subprocesses out of the production inference module", () => {
    const source = readFileSync(resolve(process.cwd(), "server/inference.ts"), "utf8");
    expect(source).not.toMatch(/python|spawn\(|exec\(/i);
    expect(source).toContain("onnxruntime-node");
    expect(source).toContain("InferenceSession.create");
  });
});
