FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN if [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; else pnpm i; fi

COPY . .
RUN pnpm build

EXPOSE 8080

CMD ["pnpm", "start"]

