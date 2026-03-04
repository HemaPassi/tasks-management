FROM golang:1.22 AS builder

# Install Node
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

# Copy frontend and build React
COPY client ./client
WORKDIR /app/client
RUN npm install && npm run build

# Copy Go backend
WORKDIR /app
COPY . .

# Copy React dist into Go root
RUN cp -r client/dist ./dist

# Build Go app
RUN go build -tags netgo -ldflags "-s -w" -o app .

# Final stage
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/app .
COPY --from=builder /app/dist ./dist
CMD ["./app"]
