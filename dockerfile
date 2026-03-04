# Stage 1: Build React frontend
FROM node:20 AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build Go backend (use Go 1.26)
FROM golang:1.26 AS backend-builder
WORKDIR /app
COPY . .
# Copy React build output into Go project root
COPY --from=frontend-builder /app/client/dist ./dist
RUN go build -tags netgo -ldflags "-s -w" -o app .

# Stage 3: Final runtime image
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=backend-builder /app/app .
COPY --from=backend-builder /app/dist ./dist
CMD ["./app"]
