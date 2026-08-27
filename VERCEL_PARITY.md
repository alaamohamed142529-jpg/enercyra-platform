# Enercyra Manus–Vercel Parity Audit

_Last audited: 2026-08-27_

## Verified in the repository

Enercyra contains the React/Vite frontend, the Express/tRPC backend, explicit Vercel function entrypoints, the MobileNetV3 ONNX model path, the LSTM forecast artifacts, the database schema, and the deployment configuration. The public frontend routes include `/`, `/classify`, `/result`, `/marketplace`, `/marketplace/:id`, `/publish`, `/my-listings`, `/businesses`, `/forecast`, `/how-it-works`, and `/about`.

The Vercel configuration uses `dist/public` for the Vite output and excludes `/api` requests from the SPA fallback. Explicit function files exist for `/api/forecast`, `/api/trpc/*`, and `/api/trpc/inference.classify`. The classification path uses direct Node ONNX inference and Sharp preprocessing; it does not invoke Python subprocesses.

All frontend image references have been migrated to local `/assets/` paths. The remaining `/manus-storage/` references are server-side storage-proxy implementation paths used for user-uploaded files and are not references to the migrated static hero or branding assets.

## Differences and blockers requiring external provider access

The Manus deployment has preconfigured Manus storage and environment values. A standalone Vercel deployment needs a valid `DATABASE_URL` and compatible external storage or a deliberately documented alternative for user-uploaded listing images. These values must be configured in Vercel and must not be committed to GitHub.

The public Vercel Classify page has been reachable during verification, and the explicit classification endpoint has returned a JSON 500 for a real-image request. This is not treated as production parity or success. The exact server-side cause requires the Vercel Runtime Log for the deployment serving the request. Until that log is available and the request returns HTTP 200 with a real MobileNetV3 prediction, production classification remains unresolved.

The Marketplace and authenticated listing-management flows are implemented in the repository, but full public Vercel verification depends on the external database and storage configuration. Local tests, TypeScript validation, and the production build pass.

## Required next verification

1. Inspect the fresh Vercel Build Log and confirm the intended commit and native dependency installation behavior.
2. Inspect the Vercel Runtime Log for one real classification request.
3. Configure authorized database and storage services if Marketplace persistence is required on Vercel.
4. Re-test Classify, Marketplace, About, Forecast, and authenticated listing workflows on the public Vercel domain.
