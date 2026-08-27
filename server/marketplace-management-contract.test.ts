import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Marketplace management contract", () => {
  it("exposes My Listings management without adding a global delete action to public cards", () => {
    const app = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");

    expect(app).toContain('href="/my-listings"');
    expect(app).toContain("Manage my listings");
    expect(app).toContain("إدارة إعلاناتي");
    expect(app).toContain("trpc.marketplace.mine.useQuery");
    expect(app).toContain("trpc.marketplace.remove.useMutation");
    expect(app).toContain('remove.mutate({ id: listing.id })');
    expect(app).not.toContain("remove.mutate({ id: item.id })");
  });
});
