FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN set -eux; \
    npm config set fetch-retries 5; \
    npm config set fetch-retry-factor 2; \
    npm config set fetch-retry-mintimeout 20000; \
    npm config set fetch-retry-maxtimeout 120000; \
    npm config set fetch-timeout 300000; \
    for attempt in 1 2 3; do \
      npm ci --omit=dev --no-audit --no-fund && break; \
      if [ "$attempt" -eq 3 ]; then \
        exit 1; \
      fi; \
      echo "npm ci failed (attempt ${attempt}), retrying..."; \
      sleep 15; \
    done

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
