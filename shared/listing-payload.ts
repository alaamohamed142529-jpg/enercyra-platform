export type ClassificationPayload = {
  source?: "model" | "demo";
  modelClassId?: string;
  classId: string;
  displayNameEn: string;
  displayNameAr: string;
  confidence?: number;
  imageName?: string;
};

export function buildListingPayload(classification: ClassificationPayload, fields: { weightKg: number; location: string; condition?: string; notes?: string }) {
  return {
    classId: classification.classId,
    displayNameEn: classification.displayNameEn,
    displayNameAr: classification.displayNameAr,
    weightKg: fields.weightKg,
    location: fields.location,
    condition: fields.condition || undefined,
    notes: fields.notes || undefined,
    imageMetadata: classification.imageName ? JSON.stringify({
      source: classification.source || "demo",
      modelClassId: classification.modelClassId,
      confidence: classification.confidence,
      fileName: classification.imageName,
      capturedAt: new Date().toISOString(),
    }) : undefined,
  };
}
