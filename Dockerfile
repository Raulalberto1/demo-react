# Usa una imagen base de node
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que correrá la aplicación
EXPOSE 3000

# Define el comando por defecto
CMD ["npm", "start"]