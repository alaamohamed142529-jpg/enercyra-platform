import { describe, expect, it } from "vitest";
import { buildListingPayload } from "../shared/listing-payload";

describe("buildListingPayload", () => {
  it("preserves the real model class, confidence, and image metadata", () => {
    const payload = buildListingPayload({
      source: "model",
      modelClassId: "24",
      classId: "plastic",
      displayNameEn: "Plastic",
      displayNameAr: "بلاستيك",
      confidence: 0.941234,
      imageName: "bottle.jpg",
      imageDataUrl: "data:image/jpeg;base64,ZmFrZQ==",
    }, { weightKg: 2.5, location: "Cairo", condition: "Clean", notes: "Sorted" });
    expect(payload.classId).toBe("plastic");
    expect(payload.displayNameEn).toBe("Plastic");
    expect(payload.weightKg).toBe(2.5);
    expect(JSON.parse(payload.imageMetadata || "{}")).toMatchObject({ source: "model", modelClassId: "24", confidence: 0.941234, fileName: "bottle.jpg" });
    expect(payload.imageDataUrl).toBe("data:image/jpeg;base64,ZmFrZQ==");
  });

  it("preserves the exact classification estimate snapshot", () => {
    const payload = buildListingPayload({ classId: "plastic", displayNameEn: "Plastic", displayNameAr: "بلاستيك" }, {
      weightKg: 2,
      location: "Minya",
      estimateSnapshot: {
        currency: "SAR",
        referencePricePerKg: 7.5,
        estimatedValue: 15,
        originalEnergyMjPerKg: 35,
        estimatedEnergyMj: 70,
        estimatedEnergyKwh: 19.444,
      },
    });
    expect(JSON.parse(payload.imageMetadata || "{}").estimateSnapshot).toEqual({ currency: "SAR", referencePricePerKg: 7.5, estimatedValue: 15, originalEnergyMjPerKg: 35, estimatedEnergyMj: 70, estimatedEnergyKwh: 19.444 });
  });
});
