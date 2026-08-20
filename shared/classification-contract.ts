import type { InferenceResult } from "../server/inference";
import type { WasteReference } from "./enercyra";

export type StoredClassification = {
  source: "model" | "demo";
  modelClassId?: string;
  classId: string;
  displayNameEn: string;
  displayNameAr: string;
  confidence?: number;
  imageName?: string;
  imageDataUrl?: string;
};

export function mapInferenceToClassification(result: InferenceResult, catalog: WasteReference[], image: { name: string; dataUrl: string }): StoredClassification {
  const match = catalog.find((entry) => entry.id === result.className);
  if (!match) throw new Error("The model class is not present in the 37-class catalog.");
  return {
    source: "model",
    modelClassId: result.classId,
    classId: match.id,
    displayNameEn: match.displayNameEn,
    displayNameAr: match.displayNameAr,
    confidence: result.confidence,
    imageName: image.name,
    imageDataUrl: image.dataUrl,
  };
}
