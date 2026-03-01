# ====== Stage 1: Build ======
FROM node:24.13.1-alpine AS builder

# Set working directory
WORKDIR /Dtorres

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy all source code
COPY . .

# Generate Prisma client and build TypeScript
RUN npx prisma generate
# Build TypeScript
RUN npx tsc

# ====== Stage 2: Production ======
FROM node:24.13.1-alpine

WORKDIR /Dtorres

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built JS files
COPY --from=builder /Dtorres/dist ./dist

# Copy prisma folder (needed at runtime)
COPY --from=builder /Dtorres/prisma ./prisma

# Expose port
EXPOSE 8888

# Start the server
CMD ["node", "dist/server.js"]