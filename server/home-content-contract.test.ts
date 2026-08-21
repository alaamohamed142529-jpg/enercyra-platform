import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("homepage content contract", () => {
  const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");

  it("does not fabricate a Plastic Bottle Recent Analysis entry", () => {
    expect(appSource).toContain("No analyses yet");
    expect(appSource).toContain("readRecentClassification");
    expect(appSource).toContain("classification.imageDataUrl");
    expect(appSource).toContain("classification.imageName");
    expect(appSource).not.toContain('<div className="mini-material">PET</div><div><strong>{lang === "ar" ? "زجاجة بلاستيكية"');
  });

  it("uses distinct functional feature-card titles and icons", () => {
    expect(appSource).toContain("Material identification");
    expect(appSource).toContain("Reference estimates");
    expect(appSource).toContain("Buyer discovery");
    expect(appSource).toContain("<ScanSearch />");
    expect(appSource).toContain("<BadgeDollarSign />");
    expect(appSource).toContain("<Handshake />");
    expect(appSource).toContain('href="/classify"');
    expect(appSource).toContain('href="/result"');
    expect(appSource).toContain('href="/businesses"');
    expect(appSource).toContain("recent-connect");
    expect(appSource).toContain("return <div className=\"recent-card\">");
    expect(appSource).toContain("{classification ? <div className=\"recent-result\">");
    expect(appSource).toContain("lang === \"ar\" ? \"تواصل\" : \"Connect\"");
  });
});

