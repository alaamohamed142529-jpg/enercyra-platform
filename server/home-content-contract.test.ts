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

  it("removes the marketplace eyebrow label while preserving its icon", () => {
    expect(appSource).toContain('<h1>{lang === "ar" ? "السوق" : "Marketplace"}</h1>');
    expect(appSource).not.toContain('<span className="eyebrow"><PackageSearch size={15} /></span>');
    expect(appSource).not.toContain("اتصالات الأعمال");
    expect(appSource).not.toContain("Business connections");
  });

  it("renders only real persisted Marketplace listings with an empty state", () => {
    expect(appSource).toContain("trpc.marketplace.list.useQuery()");
    expect(appSource).toContain("No published listings yet");
    expect(appSource).toContain("انشر أول مادة حقيقية لتظهر هنا.");
    expect(appSource).toContain('src={item.imageUrl || ""}');
    expect(appSource).not.toContain("Plastic Bottles");
    expect(appSource).not.toContain("Aluminum Cans");
    expect(appSource).not.toContain("Mixed Materials");
  });

  it("opens complete listing details while keeping contact actions isolated", () => {
    expect(appSource).toContain('<Route path="/marketplace/:id"');
    expect(appSource).toContain("listing-card-clickable");
    expect(appSource).toContain("onClick={openDetails}");
    expect(appSource).toContain("event.stopPropagation()");
    expect(appSource).toContain("function ListingDetail");
    expect(appSource).toContain("listing-detail-image");
    expect(appSource).toContain("item.condition");
    expect(appSource).toContain("item.notes");
    expect(appSource).toContain("Contact seller");
  });

  it("starts the shared header at the page edge without a stray top strip", () => {
    const stylesheet = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(stylesheet).toContain("html, body, #root { min-height: 100%; margin: 0; }");
    expect(stylesheet).toContain(".site-header { top: 0; margin-top: 0; }");
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
    expect(appSource).toContain('className="hero-function-label label-connect"');
    expect(appSource).toContain('href="/businesses" aria-label={lang === "ar" ? "تواصل مع المشترين" : "Connect with buyers"}');
    expect(appSource).toContain("{lang === \"ar\" ? \"تواصل\" : \"CONNECT\"}");
    expect(appSource).toContain("MobileNet AI");
    expect(appSource).toContain("VALUE + ENERGY");
    expect(appSource).toContain("MARKETPLACE");
    expect(appSource).toContain("return <div className=\"recent-card\">");
    expect(appSource).toContain("{classification ? <div className=\"recent-result\">");
    expect(appSource).not.toContain("recent-connect");
  });
});

