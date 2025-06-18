FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Clean install dependencies
RUN rm -rf node_modules package-lock.json && \
    npm cache clean --force && \
    npm install --legacy-peer-deps

# Copy source files
COPY . .

# Environment variables
ENV CI=false
ENV GENERATE_SOURCEMAP=false
ENV TSC_COMPILE_ON_ERROR=true
ENV REACT_APP_API_URL=https://nexa-version-management-be.up.railway.app
ENV REACT_APP_API_KEY=nexa_internal_app_key_2025

# Build the app
RUN npm run build

# Install serve
RUN npm install -g serve

# Use Railway's PORT
EXPOSE 3000

# Start the app
CMD ["sh", "-c", "serve -s build -l ${PORT:-3000}"]