import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  createListing: vi.fn().mockResolvedValue(1),
  removeListing: vi.fn().mockResolvedValue(undefined),
  listActiveListings: vi.fn().mockResolvedValue([]),
  listListingsForOwner: vi.fn().mockResolvedValue([]),
  listReferenceData: vi.fn().mockResolvedValue([]),
}));

vi.mock("./db", () => dbMocks);

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(user: TrpcContext["user"]): TrpcContext {
  return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

const user = { id: 42, openId: "owner", email: "owner@example.com", name: "Owner", loginMethod: "manus", role: "user" as const, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };

describe("marketplace authorization", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects unauthenticated listing creation and deletion", async () => {
    const caller = appRouter.createCaller(context(null));
    await expect(caller.marketplace.create({ classId: "plastic", displayNameEn: "Plastic", displayNameAr: "بلاستيك", weightKg: 10, location: "Cairo" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.marketplace.remove({ id: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("passes the authenticated owner to create and remove procedures", async () => {
    const caller = appRouter.createCaller(context(user));
    await caller.marketplace.create({ classId: "plastic", displayNameEn: "Plastic", displayNameAr: "بلاستيك", weightKg: 10, location: "Cairo", imageMetadata: "{\"fileName\":\"sample.jpg\"}" });
    await caller.marketplace.remove({ id: 7 });
    expect(dbMocks.createListing).toHaveBeenCalledWith(expect.objectContaining({ ownerId: 42, classId: "plastic", imageMetadata: "{\"fileName\":\"sample.jpg\"}" }));
    expect(dbMocks.removeListing).toHaveBeenCalledWith(42, 7);
  });

  it("scopes the same listing id to different owners instead of sharing a global delete", async () => {
    const ownerA = appRouter.createCaller(context(user));
    const ownerB = appRouter.createCaller(context({ ...user, id: 77, openId: "other-owner" }));
    await ownerA.marketplace.remove({ id: 99 });
    await ownerB.marketplace.remove({ id: 99 });
    expect(dbMocks.removeListing).toHaveBeenNthCalledWith(1, 42, 99);
    expect(dbMocks.removeListing).toHaveBeenNthCalledWith(2, 77, 99);
  });
});
