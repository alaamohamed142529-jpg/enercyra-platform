import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Businesses directory contract", () => {
  const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");

  it("keeps the public route and verified Egyptian business records", () => {
    expect(appSource).toContain('path="/businesses"');
    expect(appSource).toContain("const egyptianBusinesses");
    expect(appSource).toContain("Bekia");
    expect(appSource).toContain("Egyptian Electronics Recycling Co. (EERC)");
    expect(appSource).toContain("Geocycle Egypt");
    expect(appSource).toContain("ECARU");
    expect(appSource).toContain("hello@bekia-egypt.com");
    expect(appSource).toContain("https://ecaru.net/en/Contact");
  });

  it("keeps source attribution and a verification disclaimer visible in the directory", () => {
    expect(appSource).toContain("business-source");
    expect(appSource).toContain("Directory note: listing does not constitute endorsement or guarantee.");
    expect(appSource).toContain("Verify pricing, pickup coverage, and licensing directly");
  });
});
