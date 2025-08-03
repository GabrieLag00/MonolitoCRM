# Etapa de construcción
FROM node:21-alpine AS build

WORKDIR /app

# Copiar e instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el resto del código y construir la app
COPY . .
RUN npm run build

# Etapa de producción: servidor estático con http-server
FROM node:21-alpine AS production

# Instalar http-server globalmente
RUN npm install -g http-server

WORKDIR /app

# Copiar los archivos construidos
COPY --from=build /app/dist .

# Exponer puerto estándar del servidor
EXPOSE 3137

# Comando para servir la app
CMD ["http-server", "-p", "3137"]
