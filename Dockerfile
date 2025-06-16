# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
ENV REACT_APP_API_URL=https://nexa-version-management-be.up.railway.app
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build
ENV PORT=3000
EXPOSE $PORT
CMD serve -s build -l $PORT