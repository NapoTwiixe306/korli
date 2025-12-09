# 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

RUN npm run build

# 2 — Run
FROM node:20-alpine

WORKDIR /app

# Copy standalone server
COPY --from=builder /app/.next/standalone ./
# Copy static files - Next.js expects them at .next/static relative to server.js location
COPY --from=builder /app/.next/static ./.next/static
# Copy public files
COPY --from=builder /app/public ./public
# Copy Prisma schema, migrations, and config for migrations in production
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/package.json ./package.json
# Copy Prisma Client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

# Next.js standalone server
CMD ["node", "server.js"]

