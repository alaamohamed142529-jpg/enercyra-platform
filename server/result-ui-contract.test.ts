import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const appSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/App.tsx"), "utf8");

describe("Classification Result calculation UI contract", () => {
  it("derives reference price from the selected display currency", () => {
    expect(appSource).toContain("const referencePriceValue = item.price !== null ? (item.price * displayRate).toFixed(2) : \"—\";");
    expect(appSource).toContain("unit={`${currency}/kg`}");
  });

  it("keeps the original LHV/kg in the Reference price card before weight entry", () => {
    expect(appSource).toContain("secondaryLabel={lang === \"ar\" ? \"الطاقة الأصلية\" : \"Original energy\"}");
    expect(appSource).toContain("secondaryUnit=\"MJ/kg\"");
    expect(appSource).toContain("item.lhv === null ? \"—\" : item.lhv.toFixed(1)");
  });

  it("does not render technical uploaded filenames in the preview UI", () => {
    expect(appSource).not.toContain("<small>{classification.imageName ||");
    expect(appSource).toContain("<strong>{busy ? (lang === \"ar\" ? \"جارٍ تحليل الصورة...\" : \"Analyzing image...\") : text.uploadTitle}</strong>");
    expect(appSource).toContain("<span>{busy ? (lang === \"ar\" ? \"يتم تشغيل MobileNetV3\" : \"Running MobileNetV3\") : text.uploadSub}</span>");
  });

  it("passes Result values into the editable Publish form without pre-filling location or notes", () => {
    expect(appSource).toContain("window.sessionStorage.setItem(\"enercyra-publish-draft\", JSON.stringify({ weight: nextWeight }))");
    expect(appSource).toContain("typeof draft?.weight === \"string\" ? draft.weight : \"\"");
    expect(appSource).toContain("<input value={material} onChange={(event) => setMaterial(event.target.value)} required />");
    expect(appSource).toContain("const [location, setLocation] = useState(() => profile?.location || \"\");");
    expect(appSource).toContain("const [notes, setNotes] = useState(\"\");");
    expect(appSource).toContain("displayNameEn: lang === \"ar\" ? classification.displayNameEn : material");
    expect(appSource).toContain("displayNameAr: lang === \"ar\" ? material : classification.displayNameAr");
  });

  it("renders classification context and editable account-contact fields on Publish", () => {
    expect(appSource).toContain("className=\"publish-source-summary\"");
    expect(appSource).toContain("alt={lang === \"ar\" ? \"الصورة المصنفة\" : \"Classified waste\"}");
    expect(appSource).toContain("const profile = user as (typeof user & { location?: string; phone?: string }) | null;");
    expect(appSource).toContain("type=\"tel\" inputMode=\"tel\"");
    expect(appSource).toContain("contactPhone");
    expect(appSource).toContain("Condition (optional)");
    expect(appSource).toContain("Notes (optional)");
  });

  it("shows the weight hint only while the parsed weight is not positive", () => {
    expect(appSource).toContain("const hasWeight = parsedWeight !== null && parsedWeight > 0;");
    expect(appSource).toContain("{!hasWeight && <small id=\"weight-help\"");
  });
});
