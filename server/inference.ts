import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import * as ort from "onnxruntime-node";
import sharp from "sharp";

export type InferenceResult = {
  classId: string;
  className: string;
  confidence: number;
  top: Array<{ classId: string; className: string; confidence: number }>;
};

type ModelInfo = {
  input_size: number;
  normalize_mean: [number, number, number];
  normalize_std: [number, number, number];
};

type ClassMapping = Record<string, string>;

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MODEL_DIR = resolve(process.cwd(), "model");
const MODEL_PATH = resolve(MODEL_DIR, "mobilenetv3.onnx");
const MODEL_INFO_PATH = resolve(MODEL_DIR, "model_info.json");
const CLASS_MAPPING_PATH = resolve(MODEL_DIR, "class_mapping.json");

let inferenceRuntimePromise: Promise<{
  session: ort.InferenceSession;
  info: ModelInfo;
  classMapping: ClassMapping;
}> | undefined;

function parseImageData(dataUrl: string): Buffer {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/i);
  if (!match) throw new Error("Only JPEG, PNG, and WebP image data is supported.");
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) throw new Error("Image must be between 1 byte and 8 MB.");
  return bytes;
}

async function getInferenceRuntime() {
  if (!inferenceRuntimePromise) {
    inferenceRuntimePromise = (async () => {
      const [infoText, mappingText, session] = await Promise.all([
        readFile(MODEL_INFO_PATH, "utf8"),
        readFile(CLASS_MAPPING_PATH, "utf8"),
        ort.InferenceSession.create(MODEL_PATH, { executionProviders: ["cpu"] }),
      ]);
      return {
        session,
        info: JSON.parse(infoText) as ModelInfo,
        classMapping: JSON.parse(mappingText) as ClassMapping,
      };
    })().catch((error) => {
      inferenceRuntimePromise = undefined;
      throw new Error(`MobileNet model could not be loaded: ${error instanceof Error ? error.message : "unknown model error"}`);
    });
  }
  return inferenceRuntimePromise;
}

async function toNormalizedTensor(bytes: Buffer, info: ModelInfo): Promise<ort.Tensor> {
  const size = Number(info.input_size);
  if (!Number.isInteger(size) || size <= 0) throw new Error("Model metadata contains an invalid input size.");
  const { data, info: outputInfo } = await sharp(bytes)
    .toColourspace("srgb")
    .removeAlpha()
    .resize(size, size, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (outputInfo.channels !== 3 || data.length !== size * size * 3) throw new Error("Image preprocessing did not produce an RGB tensor.");

  const tensorData = new Float32Array(3 * size * size);
  const [meanR, meanG, meanB] = info.normalize_mean;
  const [stdR, stdG, stdB] = info.normalize_std;
  for (let pixel = 0; pixel < size * size; pixel += 1) {
    const source = pixel * 3;
    tensorData[pixel] = (data[source] / 255 - meanR) / stdR;
    tensorData[size * size + pixel] = (data[source + 1] / 255 - meanG) / stdG;
    tensorData[2 * size * size + pixel] = (data[source + 2] / 255 - meanB) / stdB;
  }
  return new ort.Tensor("float32", tensorData, [1, 3, size, size]);
}

function softmax(logits: Float32Array | number[]): number[] {
  const values = Array.from(logits);
  const max = Math.max(...values);
  const exponentials = values.map(value => Math.exp(value - max));
  const sum = exponentials.reduce((total, value) => total + value, 0);
  return exponentials.map(value => value / sum);
}

export async function runMobileNetInference(dataUrl: string): Promise<InferenceResult> {
  const bytes = parseImageData(dataUrl);
  const runtime = await getInferenceRuntime();
  const input = runtime.session.inputNames[0];
  if (!input) throw new Error("MobileNet model has no input tensor.");
  const tensor = await toNormalizedTensor(bytes, runtime.info);
  const outputs = await runtime.session.run({ [input]: tensor });
  const outputName = runtime.session.outputNames[0];
  const output = outputName ? outputs[outputName] : undefined;
  const logits = output?.data;
  if (!(logits instanceof Float32Array) || logits.length === 0) throw new Error("MobileNet model returned an invalid output tensor.");

  const probabilities = softmax(logits);
  const indices = probabilities.map((_, index) => index).sort((a, b) => probabilities[b] - probabilities[a]).slice(0, 5);
  const top = indices.map(index => {
    const classId = String(index);
    return { classId, className: runtime.classMapping[classId] ?? classId, confidence: Number(probabilities[index].toFixed(6)) };
  });
  const best = top[0];
  if (!best) throw new Error("MobileNet model returned no predictions.");
  return { classId: best.classId, className: best.className, confidence: best.confidence, top };
}
