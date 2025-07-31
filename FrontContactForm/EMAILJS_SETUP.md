# Configuración de EmailJS para el Formulario de Contacto

## 📧 Configuración de EmailJS

### 1. Crear cuenta en EmailJS
1. Ve a [EmailJS](https://www.emailjs.com/)
2. Regístrate o inicia sesión
3. Ve a tu Dashboard

### 2. Configurar el Servicio de Email
1. En el Dashboard, ve a **Email Services**
2. Haz clic en **Add Service**
3. Elige tu proveedor de email (Gmail, Outlook, Yahoo, etc.)
4. Sigue las instrucciones para conectar tu cuenta de email
5. Copia el **Service ID** que se genera

### 3. Crear Template de Email
1. Ve a **Email Templates**
2. Haz clic en **Create New Template**
3. Usa este template como ejemplo:

```html
Asunto: Nuevo mensaje de contacto de {{user_name}}

---

Has recibido un nuevo mensaje de contacto:

**De:** {{user_name}}
**Email:** {{user_email}}

**Mensaje:**
{{message}}

---

Responder a: {{reply_to}}
```

4. Guarda el template y copia el **Template ID**

### 4. Obtener Public Key
1. Ve a **Account** > **General**
2. Encuentra tu **Public Key**
3. Cópialo

### 5. Configurar Variables de Entorno
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega las siguientes variables:

```env
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

### 6. Variables disponibles en el template
El formulario enviará estas variables a tu template:

- `{{user_name}}` - Nombre del usuario
- `{{user_email}}` - Email del usuario  
- `{{message}}` - Mensaje del usuario
- `{{reply_to}}` - Email para responder

### 7. Límites de EmailJS
- Plan gratuito: 200 emails por mes
- Los emails se envían desde tu cuenta configurada
- Puedes configurar múltiples servicios de email

## 🚀 Funcionamiento

1. El usuario llena el formulario
2. Se validan los datos
3. Se guardan en tu base de datos (API existente)
4. Se envía un email usando EmailJS
5. El usuario ve la confirmación

Si falla el envío del email, la aplicación continúa funcionando normalmente ya que los datos se guardan en la base de datos.

## 🔧 Troubleshooting

- **Email no llega**: Verifica tu Service ID y que el servicio esté activo
- **Template error**: Revisa que las variables en el template coincidan
- **CORS error**: Asegúrate de tener el dominio configurado en EmailJS
- **Rate limit**: Verifica no haber excedido el límite mensual
