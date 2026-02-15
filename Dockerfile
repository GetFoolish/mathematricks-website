FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install && \
    npm install express cors

# Copy source files
COPY . .

# Build Vite app
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.cjs"]
