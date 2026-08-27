import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Businesses directory contract", () => {
  const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
  const nearbySource = readFileSync(resolve(process.cwd(), "client/src/components/NearbyFacilities.tsx"), "utf8");

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

  it("offers a permission-safe nearest compatible facility trial", () => {
    expect(appSource).toContain("NearbyFacilities");
    expect(appSource).toContain('href={`/businesses?material=${encodeURIComponent(item.en)}`}');
    expect(nearbySource).toContain("navigator.geolocation.getCurrentPosition");
    expect(nearbySource).toContain("Nearest compatible facility");
    expect(nearbySource).toContain("أقرب جهة مناسبة للمادة");
    expect(nearbySource).toContain("Verify the address and pickup coverage directly with the facility.");
    expect(nearbySource).toContain("Loading the map");
    expect(nearbySource).toContain("Compatible directory entries");
    expect(nearbySource).toContain("No compatible directory entry was found");
    expect(nearbySource).toContain("The live map could not load");
    expect(nearbySource).toContain("Live map unavailable");
    expect(nearbySource).toContain("onMapError");
  });

  it("keeps source attribution and a verification disclaimer visible in the directory", () => {
    expect(appSource).toContain("business-source");
    expect(appSource).toContain("Directory note: listing does not constitute endorsement or guarantee.");
    expect(appSource).toContain("Verify pricing, pickup coverage, and licensing directly");
  });
});
