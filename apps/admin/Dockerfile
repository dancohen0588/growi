# Multi-stage Dockerfile for Next.js Admin
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/admin/package*.json ./apps/admin/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build application
RUN npm run build:admin

# Production stage
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./.next/static
COPY --from=builder /app/apps/admin/public ./public

# Set permissions
USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]

# Development stage
FROM base AS development
WORKDIR /app

# Install all dependencies including devDependencies
COPY package*.json ./
COPY apps/admin/package*.json ./apps/admin/
RUN npm install

# Copy source code
COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev:admin"]