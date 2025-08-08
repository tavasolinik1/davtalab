# Stage 1: build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || yarn install || pnpm i
COPY . .
RUN npx prisma generate
RUN npx nest build

# Stage 2: runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/main.js"]