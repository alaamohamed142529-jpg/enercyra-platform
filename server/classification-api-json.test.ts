import { createServer, type Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "./_core/index";

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  const app = await createApp({ includeStatic: false });
  server = createServer(app);
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server did not expose a port.");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

describe("classification API JSON contract", () => {
  it("returns a JSON error for malformed image data", async () => {
    const response = await fetch(`${baseUrl}/api/trpc/inference.classify`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ json: { imageDataUrl: "data:text/plain;base64,SGVsbG8=" } }),
    });
    const contentType = response.headers.get("content-type") || "";
    const body = await response.json() as unknown;
    expect(response.ok).toBe(false);
    expect(contentType).toContain("application/json");
    expect(body).toBeTypeOf("object");
    expect(JSON.stringify(body)).toContain("Only JPEG, PNG, and WebP image data is supported.");
  });
});
