# Vercel environment variables for Enercyra

The Vercel project must define these variables in **Project Settings → Environment Variables** for the Production environment. Add the same values to Preview if preview deployments should use the same services. Never commit the values to GitHub.

| Variable | Required | Purpose |
|---|---:|---|
| `DATABASE_URL` | Yes | MySQL/TiDB connection string consumed by Drizzle ORM for listings and reference data. Use a TLS-enabled connection string when the provider requires it. |
| `JWT_SECRET` | Yes | Session-cookie signing secret. Use a long random value that is different from development. |
| `VITE_APP_ID` | Yes for OAuth | Manus OAuth application identifier. |
| `OAUTH_SERVER_URL` | Yes for OAuth | OAuth callback/backend base URL. |
| `VITE_OAUTH_PORTAL_URL` | Yes for OAuth | Login portal URL used by the browser. |
| `OWNER_OPEN_ID` | Recommended | Owner identity used by the existing server framework. |
| `OWNER_NAME` | Recommended | Owner display name used by the existing server framework. |
| `BUILT_IN_FORGE_API_URL` | Yes for storage and built-in services | Server-side Forge API base URL. |
| `BUILT_IN_FORGE_API_KEY` | Yes for storage and built-in services | Server-side Forge bearer key. Keep this secret. |
| `VITE_FRONTEND_FORGE_API_URL` | Yes for browser Forge calls | Browser-facing Forge API base URL. |
| `VITE_FRONTEND_FORGE_API_KEY` | Yes for browser Forge calls | Browser-facing Forge key as configured by the Manus project. |
| `VITE_ANALYTICS_ENDPOINT` | Optional | Analytics endpoint used in the HTML build. |
| `VITE_ANALYTICS_WEBSITE_ID` | Optional | Analytics website identifier. |
| `VITE_APP_LOGO` | Recommended | Public logo URL or path used by the site metadata. |
| `VITE_APP_TITLE` | Recommended | Browser/site title. |

After adding or changing `VITE_*` values, create a new deployment because they are injected during the Vite build. After adding `DATABASE_URL` or server-only secrets, redeploy so the function environment is refreshed.

## Dependency installation

The repository pins pnpm 10.19.0 in `package.json` and keeps the native build permission in `pnpm-workspace.yaml`. The allowlist contains only `onnxruntime-node`, whose postinstall downloads the platform-specific provider libraries needed by the Node binding. `sharp` is used for preprocessing, but its current package has no install/postinstall lifecycle hook and therefore is not added to the allowlist. Vercel should continue using `pnpm install --frozen-lockfile`; the pin and workspace settings ensure that `onnxruntime-node` is built while unrelated dependency scripts remain blocked.

## MobileNetV3 runtime

MobileNetV3 classification runs directly inside the Node.js server/function through `onnxruntime-node` and `sharp`. The production path does not invoke Python, spawn a subprocess, or depend on a persistent local server. The Vercel function includes the committed `model/` directory through `includeFiles`, and the inference session is initialized lazily and reused while the serverless instance remains warm.

The legacy `scripts/infer_mobilenet_onnx.py` file remains in the repository only as a reference for preprocessing and output-parity checks; it is not part of the production classification path.
