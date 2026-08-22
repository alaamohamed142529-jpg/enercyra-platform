import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const appSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/App.tsx"), "utf8");

describe("Classification Result calculation UI contract", () => {
  it("derives reference price from the selected display currency", () => {
    expect(appSource).toContain("const referencePriceValue = item.price !== null ? (item.price * displayRate).toFixed(2) : \"—\";");
    expect(appSource).toContain("unit={`${currency}/kg`}");
  });

  it("shows the weight hint only while the parsed weight is not positive", () => {
    expect(appSource).toContain("const hasWeight = parsedWeight !== null && parsedWeight > 0;");
    expect(appSource).toContain("{!hasWeight && <small id=\"weight-help\"");
  });
});
