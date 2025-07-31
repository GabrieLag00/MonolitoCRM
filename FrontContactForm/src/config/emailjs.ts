// Configuración para EmailJS
export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID , 
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID , 
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY , 
};

// Template variables que se enviarán a EmailJS
export interface EmailTemplateParams extends Record<string, unknown> {
  user_name: string;
  user_email: string;
  message: string;
  reply_to: string;
}
