import { describe, expect, it } from "vitest";
import { calculateEstimate, normalizeClassId } from "../shared/enercyra";
import { canManageListing } from "../shared/listing-security";
import { mobileNetReferenceCatalog } from "../shared/model-classes";
import { energyRecoveryLabel, pendingDataNotice, pendingMetricLabel, pendingMetricStatus } from "../shared/result-copy";

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

  it("normalizes model class identifiers for mapping", () => {
    expect(normalizeClassId(" Plastic  Bottle ")).toBe("plastic_bottle");
    expect(normalizeClassId(36)).toBe("36");
  });

  it("contains the exact 37 MobileNet classes with safe pending defaults", () => {
    expect(mobileNetReferenceCatalog).toHaveLength(37);
    expect(mobileNetReferenceCatalog.find((item) => item.id === "plastic")?.displayNameAr).toBe("بلاستيك");
    expect(mobileNetReferenceCatalog.every((item) => item.status === "pending")).toBe(true);
    expect(mobileNetReferenceCatalog.every((item) => item.priceEgpPerKg === null)).toBe(true);
  });

  it("marks plastic as potential energy-recovery material without inventing figures", () => {
    const plastic = mobileNetReferenceCatalog.find((item) => item.id === "plastic");
    expect(plastic?.combustible).toBe(true);
    expect(plastic?.priceEgpPerKg).toBeNull();
    expect(plastic?.lhvMjPerKg).toBeNull();
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
  });

  it("allows only the listing owner to manage a listing", () => {
    expect(canManageListing(12, 12)).toBe(true);
    expect(canManageListing(12, 13)).toBe(false);
    expect(canManageListing(0, 0)).toBe(false);
  });
});
