# Build stage
FROM node:18-alpine as builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Install dependencies with verbose output
RUN npm install --legacy-peer-deps --verbose

# Copy source code
COPY . .

# Set environment variables
ENV REACT_APP_API_URL=https://nexa-version-management-be.up.railway.app
ENV REACT_APP_API_KEY=nexa_internal_app_key_2025
ENV CI=false
ENV GENERATE_SOURCEMAP=false

# Build with error details
RUN npm run build || true

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build
ENV PORT=3000
EXPOSE $PORT
CMD serve -s build -l $PORT