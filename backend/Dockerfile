# Stage de construction
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Si tu veux démarrer l'application en mode dev, utilise "dev"
CMD ["npm", "start"]