# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- runtime ---
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app

# Runtime deps + built app
COPY --from=deps   /app/node_modules /app/node_modules
COPY --from=build  /app/dist         /app/dist
# Ensure Node sees ESM at runtime (nearest package.json to dist/index.js)
COPY --from=build  /app/package.json /app/package.json
COPY --from=build  /app/package.json /app/dist/package.json

# (optional but harmless) if you still want the build-time public/ copied
# COPY --from=build  /app/public       /app/public

EXPOSE 8080
USER node
CMD ["node", "dist/index.js"]

