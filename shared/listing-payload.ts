export type ClassificationPayload = {
  source?: "model" | "demo";
  modelClassId?: string;
  classId: string;
  displayNameEn: string;
  displayNameAr: string;
  confidence?: number;
  imageName?: string;
  imageDataUrl?: string;
};

export type EstimateSnapshot = {
  currency: string;
  referencePricePerKg: number | null;
  estimatedValue: number | null;
  originalEnergyMjPerKg: number | null;
  estimatedEnergyMj: number | null;
  estimatedEnergyKwh: number | null;
};

export function buildListingPayload(classification: ClassificationPayload, fields: { weightKg: number; location: string; contactPhone?: string; condition?: string; notes?: string; estimateSnapshot?: EstimateSnapshot }) {
  const imageMetadata = classification.imageName || fields.estimateSnapshot ? JSON.stringify({
    source: classification.source || "demo",
    modelClassId: classification.modelClassId,
    confidence: classification.confidence,
    fileName: classification.imageName,
    estimateSnapshot: fields.estimateSnapshot,
    capturedAt: new Date().toISOString(),
  }) : undefined;
  return {
    classId: classification.classId,
    displayNameEn: classification.displayNameEn,
    displayNameAr: classification.displayNameAr,
    weightKg: fields.weightKg,
    location: fields.location,
    contactPhone: fields.contactPhone || undefined,
    condition: fields.condition || undefined,
    notes: fields.notes || undefined,
    imageMetadata,
    imageDataUrl: classification.imageDataUrl || undefined,
  };
}
