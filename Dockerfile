# syntax=docker/dockerfile:1

# ---- Dependencies stage ----
FROM node:20-alpine AS deps
WORKDIR /app
# copy only the orchestrator’s manifests (fast, deterministic cache)
COPY services/orchestrator/package*.json ./
# Use lockfile if present for deterministic installs, otherwise fallback
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi

# ---- Runner stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# bring dependencies first, then the app sources
COPY --from=deps /app/node_modules ./node_modules
COPY services/orchestrator ./
# Cloud Run uses $PORT; our app binds to 0.0.0.0:$PORT
EXPOSE 8080
CMD ["node", "index.js"]
