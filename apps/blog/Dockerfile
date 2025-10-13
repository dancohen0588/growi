# Multi-stage Dockerfile for Next.js Blog
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/blog/package*.json ./apps/blog/

# Install ALL dependencies (including devDependencies for Tailwind build)
RUN npm ci && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app

# Install dependencies INCLUDING devDependencies for build
COPY package*.json ./
COPY apps/blog/package*.json ./apps/blog/
RUN npm ci

# Copy source code
COPY . .

# Build application from blog directory
WORKDIR /app/apps/blog
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/apps/blog/public ./public
COPY --from=builder /app/apps/blog/.next/standalone ./
COPY --from=builder /app/apps/blog/.next/static ./.next/static

# Set permissions
USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]

# Development stage
FROM base AS development
WORKDIR /app

# Copy source code first (needed for workspace)
COPY . .

# Install all dependencies including devDependencies
RUN npm install

EXPOSE 3001

CMD ["npm", "run", "dev"]