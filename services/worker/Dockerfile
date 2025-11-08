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
# if you don’t build, still create a dist with the entry copied
RUN mkdir -p dist && cp -a src/. dist/

# -------- runtime --------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app

COPY --from=deps  /app/node_modules     /app/node_modules
COPY --from=build /app/dist             /app/dist
COPY --from=build /app/package.json     /app/package.json
COPY --from=build /app/package.json     /app/dist/package.json

EXPOSE 8080
USER node
CMD ["node", "dist/index.js"]
