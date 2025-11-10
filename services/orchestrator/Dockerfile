# syntax=docker/dockerfile:1

# --- Build deps stage ---
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
# Copy manifest(s); copy lockfile only if present
COPY package.json package-lock.json* ./
# Install prod deps (prefer lockfile if present)
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# --- Runtime stage ---
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
# Bring in node_modules from deps layer
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the app
COPY . .
EXPOSE 8080
# Start (fallbacks if "npm start" not defined)
CMD ["sh","-lc","npm start || node server.js || node index.js"]
