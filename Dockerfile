FROM node:22-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip \
  && python3 -m pip install --no-cache-dir --break-system-packages \
       torch==2.3.1 torchvision==0.18.1 pillow \
       --index-url https://download.pytorch.org/whl/cpu \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN npm install -g corepack@latest && corepack pnpm install && corepack pnpm run build

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
