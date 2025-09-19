# --- Builder ---
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies (cached layer if package*.json unchanged)
COPY package*.json package-lock.json* ./
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copy rest of the source
COPY . .

# Build Next.js app
RUN npm run build

# --- Production Dependencies ---
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# --- Runner ---
FROM node:18-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user first
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application with correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Only copy next.config.js if it exists
COPY --from=builder /app/next.config.* ./

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]