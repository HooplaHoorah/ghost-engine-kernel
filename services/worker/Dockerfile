# Standard production Dockerfile for Node (worker)
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
