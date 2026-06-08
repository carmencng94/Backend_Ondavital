# Usar una imagen ligera de Node.js
FROM node:18-bullseye-slim

# Instalar dependencias necesarias para compilar better-sqlite3 y sharp
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Crear el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo compilación de binarios nativos)
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto configurado por Railway
EXPOSE 3000

# Comando para arrancar el servidor
CMD ["node", "server.js"]
