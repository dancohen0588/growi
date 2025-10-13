# Multi-stage Dockerfile for NestJS API
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Generate Prisma client
RUN npx prisma generate --schema=./apps/api/prisma/schema.prisma

# Build application
RUN npm run build:api

# Production stage
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy necessary files
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package*.json ./

# Set permissions
USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

CMD ["node", "dist/main.js"]

# Development stage
FROM base AS development
WORKDIR /app

# Install all dependencies including devDependencies
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=./apps/api/prisma/schema.prisma

EXPOSE 3000

CMD ["npm", "run", "start:dev"]