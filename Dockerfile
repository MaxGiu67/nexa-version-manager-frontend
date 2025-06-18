FROM node:18-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install --legacy-peer-deps

# Environment variables
ENV CI=false
ENV GENERATE_SOURCEMAP=false
ENV TSC_COMPILE_ON_ERROR=true
ENV REACT_APP_API_URL=https://nexa-version-management-be.up.railway.app
ENV REACT_APP_API_KEY=nexa_internal_app_key_2025

# Build
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]