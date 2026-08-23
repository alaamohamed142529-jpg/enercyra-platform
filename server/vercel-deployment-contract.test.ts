import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

describe("Vercel deployment contract", () => {
  it("builds the Vite client into the directory served by Vercel", () => {
    const config = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
    expect(config.framework).toBe("vite");
    expect(config.buildCommand).toBe("pnpm run build");
    expect(config.outputDirectory).toBe("dist/public");
    expect(config.installCommand).toBe("pnpm install --frozen-lockfile");
  });

  it("routes API traffic to the Express catch-all function and includes model assets", () => {
    const config = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
    const functionConfig = config.functions["api/[...path].ts"];
    expect(functionConfig).toBeDefined();
    expect(functionConfig.includeFiles).toContain("server/models/**");
    expect(functionConfig.includeFiles).toContain("model/**");
    expect(functionConfig.includeFiles).toContain("node_modules/onnxruntime-node/**");
    expect(functionConfig.includeFiles).toContain("node_modules/sharp/**");
    const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
    expect(packageJson.dependencies["onnxruntime-node"]).toBeTruthy();
    expect(packageJson.dependencies.sharp).toBeTruthy();
    const handler = readFileSync(resolve(root, "api/[...path].ts"), "utf8");
    expect(handler).toContain("createApp({ includeStatic: false })");
    expect(handler).toContain("export default async function handler");
  });

  it("pins a pnpm release that honors the native install allowlist", () => {
    const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
    expect(packageJson.packageManager).toContain("pnpm@10.19.0");
    const workspace = readFileSync(resolve(root, "pnpm-workspace.yaml"), "utf8");
    expect(workspace).toContain("onlyBuiltDependencies:");
    expect(workspace).toContain("- onnxruntime-node");
    expect(workspace).not.toContain("- sharp");
  });

  it("uses a client-side SPA fallback instead of exposing repository source files", () => {
    const config = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
    expect(config.rewrites).toEqual(expect.arrayContaining([
      { source: "/(.*)", destination: "/index.html" },
    ]));
    const bootstrap = readFileSync(resolve(root, "server/_core/index.ts"), "utf8");
    expect(bootstrap).toContain("export async function createApp");
    expect(bootstrap).toContain("if (!process.env.VERCEL)");
  });
});
