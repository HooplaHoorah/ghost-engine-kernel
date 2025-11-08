# -------- deps --------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# -------- build --------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# -------- runtime --------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app

# Runtime deps + built app
COPY --from=deps  /app/node_modules     /app/node_modules
COPY --from=build /app/dist             /app/dist

# Ensure Node treats dist/ as ESM (and root as well)
COPY --from=build /app/package.json     /app/package.json
COPY --from=build /app/package.json     /app/dist/package.json

# (optional, harmless) keep if you want an extra /app/public copy
# COPY --from=build /app/public          /app/public

EXPOSE 8080
USER node
CMD ["node", "dist/index.js"]
