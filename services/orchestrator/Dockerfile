FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm ci --omit=dev || npm install --omit=dev
COPY index.js .
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
CMD ["node", "index.js"]
