FROM node:20-slim
WORKDIR /app
COPY services/worker/package*.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY services/worker/src ./src
ENV NODE_ENV=production
EXPOSE 8080
CMD ["npm", "start"]
