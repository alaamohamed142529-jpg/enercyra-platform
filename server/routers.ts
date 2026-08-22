import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createListing, listActiveListings, listListingsForOwner, listReferenceData, removeListing } from "./db";
import { runMobileNetInference } from "./inference";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  reference: router({
    list: publicProcedure.query(() => listReferenceData()),
  }),
  inference: router({
    classify: publicProcedure.input(z.object({ imageDataUrl: z.string().max(11_000_000) })).mutation(async ({ input }) => {
      try {
        return await runMobileNetInference(input.imageDataUrl);
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Inference failed.");
      }
    }),
  }),
  marketplace: router({
    list: publicProcedure.query(() => listActiveListings()),
    mine: protectedProcedure.query(({ ctx }) => listListingsForOwner(ctx.user.id)),
    create: protectedProcedure.input(z.object({
      classId: z.string().min(1),
      displayNameEn: z.string().min(1).max(160),
      displayNameAr: z.string().min(1).max(160),
      weightKg: z.number().positive(),
      location: z.string().min(1).max(160),
      contactPhone: z.string().max(40).optional(),
      condition: z.string().max(120).optional(),
      notes: z.string().max(3000).optional(),
      imageUrl: z.string().url().optional(),
      imageMetadata: z.string().max(2000).optional(),
      imageDataUrl: z.string().startsWith("data:image/").max(11_000_000).optional(),
    })).mutation(async ({ ctx, input }) => {
      const { imageDataUrl, ...listingInput } = input;
      let imageUrl = listingInput.imageUrl;
      if (imageDataUrl) {
        const match = imageDataUrl.match(/^data:(image\/[A-Za-z0-9.+-]+);base64,(.+)$/);
        if (!match) throw new Error("Invalid classified image data");
        const [, contentType, encoded] = match;
        const extension = contentType.split("/")[1]?.replace(/[^A-Za-z0-9]/g, "") || "jpeg";
        const stored = await storagePut(`listings/${ctx.user.id}/${Date.now()}.${extension}`, Buffer.from(encoded, "base64"), contentType);
        imageUrl = stored.url;
      }
      return createListing({ ...listingInput, imageUrl, ownerId: ctx.user.id, weightKg: input.weightKg.toFixed(3) });
    }),
    remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => removeListing(ctx.user.id, input.id).then(() => ({ success: true }))),
  }),
});

export type AppRouter = typeof appRouter;
