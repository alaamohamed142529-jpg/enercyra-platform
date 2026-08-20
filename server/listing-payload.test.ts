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
    }, { weightKg: 2.5, location: "Cairo", condition: "Clean", notes: "Sorted" });
    expect(payload.classId).toBe("plastic");
    expect(payload.displayNameEn).toBe("Plastic");
    expect(payload.weightKg).toBe(2.5);
    expect(JSON.parse(payload.imageMetadata || "{}")).toMatchObject({ source: "model", modelClassId: "24", confidence: 0.941234, fileName: "bottle.jpg" });
  });
});
