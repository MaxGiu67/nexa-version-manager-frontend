# Build stage
FROM node:18-alpine as builder
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Set build environment
ENV CI=false
ENV REACT_APP_API_URL=https://nexa-version-management-be.up.railway.app
ENV REACT_APP_API_KEY=nexa_internal_app_key_2025
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the app
RUN npm run build || (echo "Build failed. Trying alternative approach..." && \
    GENERATE_SOURCEMAP=false CI=false npm run build)

# Production stage - using simple serve
FROM node:18-alpine
WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built app
COPY --from=builder /app/build ./build

# Use Railway's PORT or default to 3000
ENV PORT=3000
EXPOSE $PORT

# Start server
CMD ["sh", "-c", "serve -s build -l $PORT"]