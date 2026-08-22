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

  it("renders the About Team section from data-driven LinkedIn-linked members", () => {
    expect(appSource).toContain("const teamMembers = [");
    expect(appSource).toContain('nameEn: "Alaa Mohamed", nameAr: "آلاء محمد"');
    expect(appSource).toContain('const ENGLISH_OHOUD_NAME = ["Ohoud", "Taha"].join(" ");');
    expect(appSource).toContain('nameEn: ENGLISH_OHOUD_NAME, nameAr: "عهود طه"');
    expect(appSource).not.toContain('nameEn: "Huda Taha"');
    expect(appSource).not.toContain('nameEn: "Huda Taha", nameAr: "عهود طه"');
    expect(appSource).toContain('nameEn: "Rahma Mohamed", nameAr: "رحمة محمد"');
    expect(appSource).toContain('dir={lang === "ar" ? "rtl" : "ltr"}');
    expect(appSource).toContain("teamMembers.map");
    expect(appSource).toContain('const memberName = lang === "ar" ? member.nameAr : member.nameEn;');
    expect(appSource).not.toContain("<small>{member.role}</small>");
    expect(appSource).toContain("/manus-storage/alaa_3689a963.jpg");
    expect(appSource).toContain("/manus-storage/ohoud_5d143c3b.jpg");
    expect(appSource).toContain("/manus-storage/rahma_00948031.jpg");
    expect(appSource).toContain("https://www.linkedin.com/in/alaa-mohamed-analyst/");
    expect(appSource).toContain("https://www.linkedin.com/in/ohoudtaha/");
    expect(appSource).toContain("https://www.linkedin.com/in/rahma-mohamed-data/");
    expect(appSource).toContain("teamMembers.map");
    expect(appSource).toContain('target="_blank" rel="noopener noreferrer"');
    expect(appSource).toContain('className="team-avatar"');
  });

  it("uses the Enercyra circular mark for browser and app identity", () => {
    const indexHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
    const manifest = readFileSync(resolve(process.cwd(), "client/public/site.webmanifest"), "utf8");
    expect(indexHtml).toContain('rel="icon" type="image/x-icon" href="/favicon.ico?v=icon-2026-08-22"');
    expect(indexHtml).toContain("enercyra-circular-mark_43fba3fa.png?v=icon-2026-08-22");
    expect(indexHtml).toContain("/favicon.ico?v=icon-2026-08-22");
    expect(indexHtml).toContain('rel="manifest" href="/site.webmanifest?v=icon-2026-08-22"');
    expect(manifest).toContain('"short_name": "Enercyra"');
    expect(manifest).toContain("enercyra-circular-mark_43fba3fa.png?v=icon-2026-08-22");
    expect(manifest).toContain('"short_name": "Enercyra"');
  });

  it("encodes the About QR with the stable public homepage URL", () => {
    expect(appSource).toContain('const shareUrl = "https://enercyraai-drvxzjat.manus.space/";');
    expect(appSource).toContain("<QRCodeSVG value={shareUrl}");
    expect(appSource).toContain('marginSize={4}');
    expect(appSource).toContain('level="H"');
    expect(appSource).toContain('target="_blank"');
  });

  it("keeps Marketplace native select options readable in both themes", () => {
    const stylesheet = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(stylesheet).toContain(".market-tools select { color-scheme: dark; }");
    expect(stylesheet).toContain(".market-tools select option { background-color: #082230; color: #f4fbff; }");
    expect(stylesheet).toContain(".app-shell.theme-light .market-tools select { color-scheme: light; }");
    expect(stylesheet).toContain(".app-shell.theme-light .market-tools select option { background-color: #ffffff; color: #102d3b; }");
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

