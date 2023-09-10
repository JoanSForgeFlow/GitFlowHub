# Usar una imagen base de Node.js
FROM node:14

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el directorio local al contenedor
COPY . .

# Ejecutar la compilación de TypeScript
RUN npm run build

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]
