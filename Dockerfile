# Utiliser l'image officielle Node.js comme base
FROM node:20-alpine

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copie le fichier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copie tout le code source de l'application
COPY . .

# Compiler l'application TypeScript
RUN npm run build-dev

# Exposer le port sur lequel ton API sera accessible
EXPOSE 3000

# Commande à exécuter pour lancer l'application
CMD ["npm", "start"]
