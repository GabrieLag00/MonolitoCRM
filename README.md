# Contact Form Application - Docker Setup

Este proyecto contiene una aplicación de formulario de contacto con:
- **Backend**: Express.js (Puerto 3025)
- **Frontend**: React + Vite + TypeScript (Puerto 5173)

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker
- Docker Compose

### Configuración

1. **Clonar y navegar al directorio del proyecto:**
   ```bash
   cd c:\Users\gabo3\Desktop\efra
   ```

2. **Configurar variables de entorno:**
   ```bash
   copy .env.example .env
   ```
   Edita el archivo `.env` con tus configuraciones específicas.

3. **Ejecutar en modo desarrollo:**
   ```bash
   docker-compose up --build
   ```

4. **Acceder a la aplicación:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3025

## 📋 Comandos Disponibles

### Desarrollo
```bash
# Ejecutar en modo desarrollo con hot reload
docker-compose up

# Reconstruir contenedores
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs

# Parar contenedores
docker-compose down
```

### Producción
```bash
# Para producción, edita docker-compose.yml y cambia 'target: development' a 'target: production'
docker-compose -f docker-compose.yml up --build
```

## 🏗️ Estructura del Proyecto

```
efra/
├── docker-compose.yml       # Configuración principal de Docker Compose
├── .env.example            # Plantilla de variables de entorno
├── Contactform/           # Backend (Express.js)
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/
└── FrontContactForm/      # Frontend (React + Vite)
    ├── Dockerfile
    ├── .dockerignore
    └── src/
```

## 🔧 Configuración Personalizada

### Variables de Entorno
Edita el archivo `.env` para configurar:
- Puertos de la aplicación
- URLs de API
- Configuraciones de base de datos
- Claves de JWT
- Configuraciones de EmailJS y reCAPTCHA

### Base de Datos
Si necesitas una base de datos, descomenta la sección correspondiente en `docker-compose.yml` y configura las variables de entorno apropiadas.

### Volúmenes de Desarrollo
Los volúmenes están configurados para hot reload en desarrollo. Los cambios en el código se reflejarán automáticamente sin reiniciar los contenedores.

## 🛠️ Resolución de Problemas

### Puerto ya en uso
Si los puertos 3025 o 5173 están ocupados, modifica las variables `BACKEND_PORT` y `FRONTEND_PORT` en tu archivo `.env`.

### Problemas de permisos
En sistemas Linux/Mac, asegúrate de que Docker tenga permisos para acceder a los directorios del proyecto.

### Reconstruir desde cero
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

## 📝 Notas Adicionales

- Los Dockerfiles están optimizados con etapas multi-stage para desarrollo y producción
- Se incluyen archivos `.dockerignore` para optimizar el contexto de build
- El frontend usa Nginx en producción para mejor rendimiento
- El backend incluye configuración de usuario no-root para mayor seguridad en producción
