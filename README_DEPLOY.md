# 🚀 Contact Form App - Despliegue

## 📋 Configuración inicial

### 1. **Clonar repositorio**
```bash
git clone https://github.com/TU_USUARIO/contactform-app.git
cd contactform-app
```

### 2. **Configurar variables de entorno**

#### **Para desarrollo:**
```bash
cp .env.example .env
# Editar .env con tus valores reales
```

#### **Para producción (VPS):**
```bash
cp .env.production .env
# Editar .env con:
# - Tu IP de VPS
# - Tus credenciales de Railway
# - Tus claves JWT, EmailJS, reCAPTCHA
```

### 3. **Ejecutar**

#### **Desarrollo:**
```bash
docker-compose up --build
```

#### **Producción:**
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔒 **Seguridad**

- ❌ **NUNCA** subas archivos `.env` a Git
- ✅ **SÍ** sube archivos `.env.example`
- 🔑 Cambia JWT secrets en producción
- 🔐 Usa contraseñas seguras

## 📱 **URLs**

- **Desarrollo:** http://localhost:5173
- **Producción:** http://TU_IP_VPS

## 🛠️ **Variables críticas a configurar:**

1. `ALLOWED_ORIGINS` - Dominios permitidos para CORS
2. `JWT_SECRET` - Clave para tokens JWT
3. `DB_*` - Credenciales de base de datos
4. `VITE_EMAILJS_*` - Configuración EmailJS
5. `VITE_RECAPTCHA_*` - Configuración reCAPTCHA
