FROM node:20-alpine

WORKDIR /app

# On copie uniquement les fichiers de dépendances pour optimiser le cache Docker
COPY package.json package-lock.json* ./

# On installe les dépendances
RUN npm install

# On copie le reste du code source
COPY . .

# On expose le port de Vite
EXPOSE 5173

# On lance le serveur de développement accessible depuis l'extérieur du conteneur
CMD ["npm", "run", "dev", "--", "--host"]
