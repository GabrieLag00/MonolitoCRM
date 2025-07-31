# 🚀 Configuración CORS - Comandos para ejecutar

## **1. Subir cambios desde tu PC:**
```powershell
cd c:\Users\gabo3\Desktop\efra
git add .
git commit -m "Fix CORS with better logging and origins"
git push
```

## **2. En la VPS, actualizar y ver logs:**
```bash
# Actualizar código
cd ~/MonolitoCRM
git pull

# Copiar configuración real (con nuevos orígenes)
cp .env.production.real .env

# Reconstruir con nuevos logs
docker-compose -f docker-compose.prod.yml up -d --build

# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f backend
```

## **3. Desde el frontend, hacer una petición y revisar qué sale en logs**

Los logs te dirán exactamente:
- ✅ Qué origen está enviando el frontend
- ✅ Qué orígenes están permitidos
- ✅ Por qué se rechaza

## **4. Ajustar .env según lo que veas en logs**

Si ves algo como:
```
CORS check for origin: http://159.203.136.17:3000
Available origins: ['http://159.203.136.17', 'https://159.203.136.17']
Origin rejected: http://159.203.136.17:3000
```

Entonces agrega ese origen específico al ALLOWED_ORIGINS.

## **5. Configuración final sugerida:**

### **Para desarrollo (.env):**
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

### **Para producción (.env.production.real):**
```env
ALLOWED_ORIGINS=http://159.203.136.17,https://159.203.136.17,http://159.203.136.17:80,https://159.203.136.17:80
```

## **6. Si quieres ser más permisivo temporalmente:**
```env
ALLOWED_ORIGINS=*
```
(Pero no recomendado para producción por seguridad)
