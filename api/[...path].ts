import type { Express } from "express";
import { createApp } from "../server/_core/index";

type VercelRequest = Parameters<Express>[0] & { query?: Record<string, string | string[]> };
type VercelResponse = Parameters<Express>[1];

let appPromise: Promise<Express> | undefined;

export default async function handler(request: VercelRequest, response: VercelResponse) {
  appPromise ??= createApp({ includeStatic: false });
  const app = await appPromise;
  return app(request, response);
}

export const config = {
  maxDuration: 60,
};
