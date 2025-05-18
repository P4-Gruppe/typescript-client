# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies into temp directory
FROM base AS deps
COPY package.json ./
# Install dependencies with Bun
RUN bun install --frozen-lockfile

# Build the Next.js application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Set production environment
ENV NODE_ENV=production
# Set the API URL during build
ENV REDTYPE_URL=http://host.docker.internal:1337
# Build Next.js app with Turbopack
RUN bun run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Keep this for runtime as well
ENV REDTYPE_URL=http://host.docker.internal:1337

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

# Expose port
EXPOSE 3000

# Set the correct permissions
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["bun", "server.js"]