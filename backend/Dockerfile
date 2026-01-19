# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install OpenSSL required by Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy prisma files
COPY prisma ./prisma

# Generate Prisma client for Linux
RUN npx prisma generate

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Expose port
EXPOSE 3000

# Run development server
CMD ["npm", "run", "dev"]
