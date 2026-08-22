import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
if (config.outputDirectory !== "dist/public") throw new Error("Vercel output directory must be dist/public");
if (config.buildCommand !== "pnpm run build") throw new Error("Vercel build command is incorrect");
if (!config.functions?.["api/[...path].ts"]) throw new Error("Vercel API catch-all function is missing");
if (!config.functions["api/[...path].ts"].includeFiles?.includes("server/models/**")) throw new Error("LSTM artifacts are not included");
if (!config.rewrites?.some((rewrite) => rewrite.source === "/(.*)" && rewrite.destination === "/index.html")) throw new Error("SPA fallback is missing");
console.log("Vercel config validation: OK");
