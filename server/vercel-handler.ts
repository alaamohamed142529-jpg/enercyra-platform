import type { Express } from "express";
import { createApp } from "./_core/index";

type VercelRequest = Parameters<Express>[0] & {
  query?: Record<string, string | string[]>;
};
type VercelResponse = Parameters<Express>[1];

export function createVercelHandler() {
  let appPromise: Promise<Express> | undefined;

  return async function vercelHandler(request: VercelRequest, response: VercelResponse) {
    console.info("[Vercel API] request", request.method, request.url);
    try {
      appPromise ??= createApp({ includeStatic: false });
      const app = await appPromise;
      return app(request, response);
    } catch (error) {
      console.error("[Vercel API] initialization or request failure", error);
      if (response.headersSent) return;
      const message = error instanceof Error ? error.message : "The API request could not be completed.";
      response.statusCode = 500;
      response.setHeader("content-type", "application/json; charset=utf-8");
      response.end(JSON.stringify({ success: false, error: message }));
    }
  };
}
