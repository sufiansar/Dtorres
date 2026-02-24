# ====== Stage 1: Build ======
FROM node:24.13.1-alpine AS builder

WORKDIR /Dtorres

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ====== Stage 2: Production ======
FROM node:24.13.1-alpine

WORKDIR /Dtorres

COPY package*.json ./
RUN npm install --only=production

# Copy built JS
COPY --from=builder /Dtorres/dist ./dist

#Copy Template files
COPY --from=builder /Dtorres/src/app/utility/templates/ ./dist/app/utility/templates/

# Copy prisma folder (IMPORTANT)
COPY --from=builder /Dtorres/prisma ./prisma

# Generate prisma client HERE
RUN npx prisma generate

EXPOSE 8888
CMD ["node", "dist/server.js"]