FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || yarn install || pnpm i
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]