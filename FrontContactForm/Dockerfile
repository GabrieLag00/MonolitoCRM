# Etapa de construcción
FROM node:21-alpine AS build

WORKDIR /app

# Argumentos de construcción para las variables de entorno
ARG VITE_URL_API=https://3278.efdiaz.xyz
ARG VITE_EMAILJS_SERVICE_ID=service_tsxkv97
ARG VITE_EMAILJS_TEMPLATE_ID=template_t03ogs8
ARG VITE_EMAILJS_PUBLIC_KEY=FdgXaGAkrhA92PMdM
ARG VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI

# Establecer las variables de entorno para el build
ENV VITE_URL_API=$VITE_URL_API
ENV VITE_EMAILJS_SERVICE_ID=$VITE_EMAILJS_SERVICE_ID
ENV VITE_EMAILJS_TEMPLATE_ID=$VITE_EMAILJS_TEMPLATE_ID
ENV VITE_EMAILJS_PUBLIC_KEY=$VITE_EMAILJS_PUBLIC_KEY
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY

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
