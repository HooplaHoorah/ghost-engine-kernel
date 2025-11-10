FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./ || true
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    elif [ -f package.json ]; then \
      npm install --omit=dev; \
    else \
      echo "No package.json; skipping install"; \
    fi

FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules 2>/dev/null || true
COPY . .
EXPOSE 8080
CMD ["sh","-lc","npm start || node server.js"]
