FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including express and cors for server)
RUN npm install && \
    npm install express cors

# Copy Netlify functions and server
COPY netlify/ ./netlify/
COPY server.cjs ./

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.cjs"]
