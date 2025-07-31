# Etapa de desarrollo
FROM node:21-alpine AS development

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3025

# Comando para desarrollo
CMD ["npm", "run", "dev"]

# Etapa de producción
FROM node:21-alpine AS production

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3025

# Comando para producción
CMD ["npm", "start"]