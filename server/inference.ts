import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

export type InferenceResult = {
  classId: string;
  className: string;
  confidence: number;
  top: Array<{ classId: string; className: string; confidence: number }>;
};

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function parseImageData(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/i);
  if (!match) throw new Error("Only JPEG, PNG, and WebP image data is supported.");
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) throw new Error("Image must be between 1 byte and 8 MB.");
  return bytes;
}

export async function runMobileNetInference(dataUrl: string): Promise<InferenceResult> {
  const bytes = parseImageData(dataUrl);
  const workspace = await mkdtemp(join(tmpdir(), "enercyra-inference-"));
  const extension = dataUrl.startsWith("data:image/png") ? "png" : dataUrl.startsWith("data:image/webp") ? "webp" : "jpg";
  const imagePath = join(workspace, `${randomUUID()}.${extension}`);
  await writeFile(imagePath, bytes);
  try {
    const scriptPath = resolve(process.cwd(), "scripts/infer_mobilenet.py");
    return await new Promise<InferenceResult>((resolveResult, reject) => {
      const child = spawn("python3", [scriptPath, imagePath], { stdio: ["ignore", "pipe", "pipe"] });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
      child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
      child.on("error", reject);
      child.on("close", (code) => {
        if (code !== 0) return reject(new Error(stderr.trim() || `Inference process exited with code ${code}`));
        try {
          const result = JSON.parse(stdout) as InferenceResult;
          if (!result.classId || !result.className || typeof result.confidence !== "number") throw new Error("Inference returned an invalid result.");
          resolveResult(result);
        } catch (error) {
          reject(error instanceof Error ? error : new Error("Inference returned invalid JSON."));
        }
      });
    });
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
}
