# services/orchestrator/Dockerfile

FROM node:20-alpine AS base
WORKDIR /app

# ---- deps (production) ----
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

# ---- build (copies sources and produces dist/) ----
FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN npm run build

# ---- runtime (minimal) ----
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app

# ship only what's needed at runtime
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/public /app/public

EXPOSE 8080
USER node
CMD ["node", "dist/index.js"]
