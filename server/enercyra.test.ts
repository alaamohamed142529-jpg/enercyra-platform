import { describe, expect, it } from "vitest";
import { calculateEstimate, formatWeightKg, normalizeClassId, parseWeightInput } from "../shared/enercyra";
import { canManageListing } from "../shared/listing-security";
import { mobileNetReferenceCatalog } from "../shared/model-classes";
import { energyRecoveryLabel, notebookReferenceNotice, pendingDataNotice, pendingMetricLabel, pendingMetricStatus } from "../shared/result-copy";

describe("Enercyra reference estimates", () => {
  it("calculates reference value and energy in MJ and kWh", () => {
    const result = calculateEstimate(10, {
      priceEgpPerKg: 4,
      lhvMjPerKg: 35,
      status: "reference",
    });

    expect(result.valueEgp).toBe(40);
    expect(result.energyMj).toBe(350);
    expect(result.energyKwh).toBeCloseTo(97.2222, 3);
    expect(result.status).toBe("reference");
    expect(result.disclaimer).toContain("Reference Estimate");
  });

  it("keeps unavailable values null instead of inventing figures", () => {
    const result = calculateEstimate(5, {
      priceEgpPerKg: null,
      lhvMjPerKg: null,
      status: "pending",
    });

    expect(result.valueEgp).toBeNull();
    expect(result.energyMj).toBeNull();
    expect(result.energyKwh).toBeNull();
    expect(result.status).toBe("pending");
  });

  it("parses editable weight values without locking the default 10 kg", () => {
    expect(parseWeightInput("2")).toBe(2);
    expect(parseWeightInput("10.5")).toBe(10.5);
    expect(parseWeightInput("١٠٫٥")).toBe(10.5);
    expect(parseWeightInput("2,5")).toBe(2.5);
    expect(parseWeightInput("")).toBe(0);
  });

  it("recalculates verified estimates for arbitrary parsed weights", () => {
    const result = calculateEstimate(parseWeightInput("2.5"), { priceEgpPerKg: 4, lhvMjPerKg: 35, status: "reference" });
    expect(result.weightKg).toBe(2.5);
    expect(result.valueEgp).toBe(10);
    expect(result.energyKwh).toBeCloseTo(24.3055, 3);
  });

  it("keeps edited weights distinct while pending catalog data stays null", () => {
    const result = calculateEstimate(parseWeightInput("2.5"), { priceEgpPerKg: null, lhvMjPerKg: null, status: "pending" });
    expect(result.weightKg).toBe(2.5);
    expect(result.valueEgp).toBeNull();
    expect(result.energyKwh).toBeNull();
    expect(result.status).toBe("pending");
  });

  it("formats listing weights without unnecessary trailing zeroes", () => {
    expect(formatWeightKg("50.000")).toBe("50");
    expect(formatWeightKg("2.500")).toBe("2.5");
    expect(formatWeightKg(0.125)).toBe("0.125");
  });

  it("normalizes model class identifiers for mapping", () => {
    expect(normalizeClassId(" Plastic  Bottle ")).toBe("plastic_bottle");
    expect(normalizeClassId(36)).toBe("36");
  });

  it("contains the exact 37 MobileNet classes and explicit notebook-reference coverage", () => {
    expect(mobileNetReferenceCatalog).toHaveLength(37);
    expect(mobileNetReferenceCatalog.find((item) => item.id === "plastic")?.displayNameAr).toBe("بلاستيك");
    expect(mobileNetReferenceCatalog.find((item) => item.id === "plastic")?.status).toBe("reference");
    expect(mobileNetReferenceCatalog.find((item) => item.id === "plastic")?.sourceNote).toContain("Plastic_Products");
    expect(mobileNetReferenceCatalog.some((item) => item.status === "pending")).toBe(true);
    expect(mobileNetReferenceCatalog.find((item) => item.id === "metal")?.priceEgpPerKg).toBe(8);
    expect(mobileNetReferenceCatalog.find((item) => item.id === "metal")?.lhvMjPerKg).toBeNull();
    expect(mobileNetReferenceCatalog.find((item) => item.id === "metal")?.combustible).toBe(false);
  });

  it("maps plastic to the notebook reference scenario and calculates 10 kg outputs", () => {
    const plastic = mobileNetReferenceCatalog.find((item) => item.id === "plastic");
    expect(plastic?.combustible).toBe(true);
    expect(plastic?.priceEgpPerKg).toBe(4);
    expect(plastic?.lhvMjPerKg).toBe(35);
    const result = calculateEstimate(10, { priceEgpPerKg: plastic!.priceEgpPerKg, lhvMjPerKg: plastic!.lhvMjPerKg, status: plastic!.status });
    expect(result.valueEgp).toBe(40);
    expect(result.energyMj).toBe(350);
    expect(result.energyKwh).toBeCloseTo(97.222, 3);
  });

  it("keeps pending estimate labels meaningful after weight entry", () => {
    const result = calculateEstimate(10, { priceEgpPerKg: null, lhvMjPerKg: null, status: "pending" });
    expect(result.valueEgp).toBeNull();
    expect(result.energyKwh).toBeNull();
    expect(result.disclaimer).toContain("Reference Estimate");
  });

  it("keeps Result safety and pending labels explicit in English and Arabic", () => {
    expect(energyRecoveryLabel("en", true)).toBe("Potential");
    expect(energyRecoveryLabel("ar", true)).toBe("مبدئيًا نعم");
    expect(pendingMetricLabel("en")).toBe("Pending");
    expect(pendingMetricStatus("ar")).toBe("بانتظار التحقق");
    expect(pendingDataNotice("en")).toContain("pending verification");
    expect(pendingDataNotice("ar")).toContain("قيد التحقق");
    expect(notebookReferenceNotice("en")).toContain("LHV");
    expect(notebookReferenceNotice("en")).toContain("dividing MJ by 3.6");
    expect(notebookReferenceNotice("ar")).toContain("القيمة الحرارية الدنيا");
  });

  it("allows only the listing owner to manage a listing", () => {
    expect(canManageListing(12, 12)).toBe(true);
    expect(canManageListing(12, 13)).toBe(false);
    expect(canManageListing(0, 0)).toBe(false);
  });
});
