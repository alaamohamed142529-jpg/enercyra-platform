import { describe, expect, it } from "vitest";
import { mobileNetReferenceCatalog } from "../shared/model-classes";
import { mapInferenceToClassification } from "../shared/classification-contract";
import { buildListingPayload } from "../shared/listing-payload";

describe("Classify to Result to Publish contract", () => {
  it("maps a MobileNet result into the exact persisted Publish payload", () => {
    const stored = mapInferenceToClassification({
      classId: "24",
      className: "plastic",
      confidence: 0.941234,
      top: [{ classId: "24", className: "plastic", confidence: 0.941234 }],
    }, mobileNetReferenceCatalog, { name: "waste-photo.jpg", dataUrl: "data:image/jpeg;base64,fixture" });
    const payload = buildListingPayload(stored, { weightKg: 3, location: "Cairo", condition: "Clean", notes: "Sorted" });
    const imageMetadata = JSON.parse(payload.imageMetadata || "{}");
    expect(stored.classId).toBe("plastic");
    expect(stored.displayNameAr).toBe("بلاستيك");
    expect(payload.classId).toBe("plastic");
    expect(payload.displayNameEn).toBe("Plastic");
    expect(imageMetadata).toMatchObject({ source: "model", modelClassId: "24", confidence: 0.941234, fileName: "waste-photo.jpg" });
  });
});
