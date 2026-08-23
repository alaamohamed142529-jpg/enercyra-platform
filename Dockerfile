FROM node:22-slim

WORKDIR /app
COPY . .
RUN npm exec --yes --package=pnpm@10.19.0 -- pnpm install --frozen-lockfile \
  && npm exec --yes --package=pnpm@10.19.0 -- pnpm run build

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
