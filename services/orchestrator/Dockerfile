FROM node:20-alpine AS base
WORKDIR /app

# Install production deps (locked)
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit-dev

# Build the app (copies index.js -> dist/index.js and public -> dist/public)
FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN npm run build

# Runtime image
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app

# Bring runtime deps + built assets + package.json (for ESM "type": "module")
COPY --from=deps  /app/node_modules /app/node_modules
COPY --from=build /app/dist         /app/dist
COPY --from=build /app/public       /app/public
COPY --from=build /app/package.json /app/package.json

EXPOSE 8080
USER node
CMD ["node", "dist/index.js"]
