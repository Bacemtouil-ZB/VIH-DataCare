FROM node:20-bookworm-slim AS build

WORKDIR /app

# Etape de build Vite.
COPY package*.json ./
RUN npm ci --include=optional --no-audit --no-fund

COPY . .

ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

# Verifie les imports sensibles a la casse avant de generer les assets de production.
RUN npm run check:imports-case && npm run build

FROM nginx:1.27-alpine

# Etape runtime minimale: Nginx sert les fichiers statiques construits.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
