export type EstimateStatus = "reference" | "pending";

export type WasteReference = {
  id: string;
  displayNameEn: string;
  displayNameAr: string;
  category: string;
  priceEgpPerKg: number | null;
  lhvMjPerKg: number | null;
  combustible: boolean;
  status: EstimateStatus;
  sourceNote: string;
  disclaimer: string;
};

export type EstimateResult = {
  weightKg: number;
  valueEgp: number | null;
  energyMj: number | null;
  energyKwh: number | null;
  status: EstimateStatus;
  disclaimer: string;
};

export const referenceDisclaimer =
  "Reference Estimate only. Values may vary by market, material quality, and local handling conditions.";

export function calculateEstimate(weightKg: number, reference: Pick<WasteReference, "priceEgpPerKg" | "lhvMjPerKg" | "status">): EstimateResult {
  const safeWeight = Number.isFinite(weightKg) && weightKg >= 0 ? weightKg : 0;
  const valueEgp = reference.priceEgpPerKg === null ? null : safeWeight * reference.priceEgpPerKg;
  const energyMj = reference.lhvMjPerKg === null ? null : safeWeight * reference.lhvMjPerKg;
  const energyKwh = energyMj === null ? null : energyMj / 3.6;
  return {
    weightKg: safeWeight,
    valueEgp,
    energyMj,
    energyKwh,
    status: reference.status,
    disclaimer: referenceDisclaimer,
  };
}

export function normalizeClassId(value: string | number): string {
  return String(value).trim().toLowerCase().replace(/\s+/g, "_");
}
