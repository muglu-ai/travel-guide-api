# Use official Node.js LTS image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production=false

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# --- Production image ---
FROM node:20-alpine
WORKDIR /app

# Copy only built files and production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./

# Expose port (default 8000, can be overridden)
EXPOSE 8000

# Start the server
CMD ["node", "dist/server.js"]
