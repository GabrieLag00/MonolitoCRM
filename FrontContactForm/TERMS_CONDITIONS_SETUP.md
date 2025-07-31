# Formulario de Contacto con Términos y Condiciones

## 📋 Funcionalidades Implementadas

### ✅ Checkbox de Términos y Condiciones
- **Validación obligatoria**: El usuario debe marcar la casilla para poder enviar el formulario
- **Enlaces interactivos**: Los enlaces a "términos y condiciones" y "política de privacidad" redirigen a `/privacy`
- **Validación en tiempo real**: Muestra errores si no se aceptan los términos
- **Estado del botón**: Se deshabilita automáticamente si no se aceptan los términos

### 🎨 Diseño y UX
- **Animaciones de error**: El checkbox se agita cuando hay errores
- **Estados del botón**:
  - ✅ Normal: "Solicitar Demo" (cuando términos están aceptados)
  - 🔒 Bloqueado: "Acepta los términos para continuar" (cuando términos NO están aceptados)
  - ⏳ Enviando: "Enviando..." (durante el envío)
- **Colores consistentes**: Mantiene la paleta purple/blue del diseño

### 🔧 Validación
- **Schema de Zod actualizado**: Incluye validación del checkbox
- **Mensajes de error personalizados**: Texto específico para términos y condiciones
- **Validación en tiempo real**: Se valida al marcar/desmarcar el checkbox

## 🚀 Cómo Funciona

### 1. Estado del Formulario
```typescript
interface ContactForm {
  nombre: string;
  email: string;
  mensaje: string;
  estado: "pendiente";
  termsAccepted: boolean; // ← Nuevo campo
}
```

### 2. Validación con Zod
```typescript
const contactSchema = z.object({
  // ... otros campos
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Debes aceptar los términos y condiciones para continuar"
  }),
});
```

### 3. Componente Checkbox
- Usa Radix UI para accesibilidad
- Maneja estado booleano
- Enlaza con la función de validación

### 4. Comportamiento del Botón
- **Deshabilitado** cuando `termsAccepted = false`
- **Habilitado** cuando `termsAccepted = true` y no está enviando
- **Estado de carga** durante el envío

## 🔗 Enlaces y Navegación

Los enlaces en el checkbox llevan a la página existente `/privacy` que contiene:
- Política de Privacidad completa
- Términos y Condiciones
- Información sobre cookies
- Derechos del usuario

## 🎯 Puntos Clave

1. **UX Mejorada**: El usuario sabe exactamente qué debe hacer para continuar
2. **Cumplimiento Legal**: Requiere aceptación explícita de términos
3. **Accesibilidad**: Usa componentes accesibles de Radix UI
4. **Consistencia**: Mantiene el diseño y animaciones existentes
5. **Validación Robusta**: Maneja errores tanto del checkbox como de otros campos

## 🛠️ Personalización

### Cambiar textos del checkbox:
```tsx
// En el componente ContactForm, línea ~361
<Label htmlFor="termsAccepted">
  Acepto los{" "}
  <button onClick={() => navigate("/privacy")}>
    términos y condiciones
  </button>
  {" "}y la{" "}
  <button onClick={() => navigate("/privacy")}>
    política de privacidad
  </button>
</Label>
```

### Cambiar comportamiento del botón:
```tsx
// Puedes modificar la lógica en la línea ~394
disabled={isSubmitting || !formData.termsAccepted}
```

### Agregar más validaciones:
```typescript
// En el schema de Zod, puedes agregar más reglas
termsAccepted: z.boolean()
  .refine(val => val === true, { message: "Términos requeridos" })
  .refine(() => someOtherCondition, { message: "Otra validación" })
```

## ✨ Resultado Final

El formulario ahora tiene una experiencia completa que:
- ✅ Protege legalmente tu empresa
- ✅ Mejora la experiencia del usuario
- ✅ Mantiene el diseño elegante
- ✅ Incluye validaciones robustas
- ✅ Es completamente funcional y accesible
