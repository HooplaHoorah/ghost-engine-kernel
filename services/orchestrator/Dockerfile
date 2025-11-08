FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --omit-dev

FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
# Ensure ESM works at runtime
COPY package*.json ./
COPY --from=deps  /app/node_modules /app/node_modules
COPY --from=build /app/dist         /app/dist
COPY --from=build /app/public       /app/public
USER node
CMD ["node", "dist/index.js"]
