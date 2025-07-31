# 🔧 SOLUCIONADO - Error de CORS

## ❌ **El Error que tenías:**
```
Access to XMLHttpRequest at 'http://localhost:3025/api/contactos' from origin 'http://localhost:5173' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
The 'Access-Control-Allow-Origin' header has a value 'https://landingcrm-production.up.railway.app' 
that is not equal to the supplied origin.
```

## ✅ **¿Qué se arregló?**

1. **Problema:** El backend tenía hardcodeado un origen específico en CORS
2. **Solución:** Configuré CORS dinámico usando variables de entorno
3. **Resultado:** Ahora funciona tanto en desarrollo como en producción

## 🔧 **Cambios realizados:**

### **1. Backend (`src/index.js`):**
- ✅ CORS dinámico con múltiples orígenes permitidos
- ✅ Configuración flexible usando `ALLOWED_ORIGINS`
- ✅ Permite requests sin origin (Postman, apps móviles)

### **2. Variables de entorno:**
- ✅ **Desarrollo:** `localhost:5173`, `localhost:3000`
- ✅ **Producción:** Tu IP de VPS + dominios Railway

## 🧪 **Probar localmente:**
```powershell
cd c:\Users\gabo3\Desktop\efra

# Parar contenedores existentes
docker-compose down

# Reconstruir con la nueva configuración
docker-compose up --build
```

**Acceder a:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3025

## 🚀 **Desplegar en VPS:**

### **Paso 1: Subir archivos actualizados**
```powershell
scp -r "c:\Users\gabo3\Desktop\efra" root@159.203.136.17:/root/
```

### **Paso 2: Ejecutar en VPS**
```bash
ssh root@159.203.136.17
cd /root/efra

# Usar configuración de producción (ya incluye CORS para VPS)
cp .env.production .env

# Parar contenedores existentes
docker-compose -f docker-compose.prod.yml down

# Ejecutar con nueva configuración
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🌐 **Configuración de CORS:**

### **Desarrollo (`.env`):**
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

### **Producción (`.env.production`):**
```env
ALLOWED_ORIGINS=http://159.203.136.17,https://159.203.136.17,https://landingcrm-production.up.railway.app
```

## 🔍 **Verificar que funciona:**

### **Desarrollo:**
1. Frontend: http://localhost:5173
2. Hacer una petición desde el formulario
3. No debería haber errores de CORS

### **Producción:**
1. Frontend: http://159.203.136.17
2. Hacer una petición desde el formulario
3. Verificar en logs: `docker-compose -f docker-compose.prod.yml logs backend`

## 🛠️ **Si aún hay problemas:**

### **Agregar más orígenes:**
```bash
# En el archivo .env, agregar más URLs separadas por comas
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://tu-dominio.com
```

### **Debug CORS:**
```bash
# Ver logs del backend
docker-compose logs backend

# Verificar variables de entorno
docker exec contact-backend env | grep ALLOWED_ORIGINS
```

## ✅ **¡Ya no debería haber errores de CORS!**

El backend ahora acepta peticiones desde:
- ✅ `localhost:5173` (desarrollo)
- ✅ `159.203.136.17` (VPS)
- ✅ `landingcrm-production.up.railway.app` (Railway)
- ✅ Cualquier origen que agregues a `ALLOWED_ORIGINS`
