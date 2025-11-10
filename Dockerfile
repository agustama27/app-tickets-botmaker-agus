FROM node:20-alpine

WORKDIR /app

# Copiar archivos del backend
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm i --frozen-lockfile

# Copiar el resto de los archivos del backend
COPY backend/ ./

# Build
RUN pnpm build

EXPOSE 8080

CMD ["pnpm", "start"]

