"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, ArrowRight, AlertCircle, User, Mail, MessageSquare, Sparkles, Send, X, Lock } from "lucide-react";
import { z } from "zod";
import { PostContactos } from "@/api/services/contactService";
import type { IContacto } from "@/types/Contacto";
import { useAuth } from "@/hook/useAuth";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG, type EmailTemplateParams } from "@/config/emailjs";

const contactSchema = z.object({
  nombre: z.string().min(1, "El nombre completo es requerido"),
  email: z.string().email("Debe ser un correo electrónico válido"),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Debes aceptar los términos y condiciones para continuar"
  }),
});

interface ContactForm {
  nombre: string;
  email: string;
  mensaje: string;
  estado: "pendiente";
  termsAccepted: boolean;
}

export default function ContactForm() {
const { accessToken } = useAuth(); // 👈 ahora dentro del componente
const navigate = useNavigate();
const [formData, setFormData] = useState<ContactForm>({
  nombre: "",
  email: "",
  mensaje: "",
  estado: "pendiente",
  termsAccepted: false,
});
const [errors, setErrors] = useState<{ nombre?: string; email?: string; mensaje?: string; termsAccepted?: string }>({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [showAlert, setShowAlert] = useState(false);
const [alertMessage, setAlertMessage] = useState("");
const [alertType, setAlertType] = useState<"success" | "error">("error");

// Función para enviar correo con EmailJS
const sendEmailJS = async (formData: ContactForm): Promise<void> => {
  try {
    const templateParams: EmailTemplateParams = {
      user_name: formData.nombre,
      user_email: formData.email,
      message: formData.mensaje,
      reply_to: formData.email,
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log("Email enviado exitosamente:", result);
  } catch (error) {
    console.error("Error enviando email:", error);
    throw new Error("Error al enviar el correo electrónico");
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrors({});
  console.log("Iniciando envío del formulario:", formData);

  try {
    contactSchema.parse(formData);
    console.log("Validación frontend exitosa");

    const submissionData: IContacto = {
      nombre: formData.nombre,
      email: formData.email,
      mensaje: formData.mensaje,
      estado: "pendiente",
      message: "",
      id: 0,
      createdAt: "",
      updatedAt: "",
    };
    console.log("Datos preparados para enviar:", submissionData);

    // Envío autenticado con accessToken desde el contexto
    const response = await PostContactos(submissionData, accessToken);
    console.log("Respuesta del backend:", response);

    if (!response || response.status !== 201) {
      throw new Error(response?.message || "Error en el servidor");
    }

    // Enviar correo con EmailJS después de guardar en la base de datos
    try {
      await sendEmailJS(formData);
      console.log("Correo enviado exitosamente con EmailJS");
    } catch (emailError) {
      console.warn("Error enviando correo con EmailJS:", emailError);
      // No interrumpir el flujo si falla el email, ya que los datos se guardaron
    }

    // Si el backend devuelve un nuevo accessToken, actualízalo
    // if (response.accessToken) {
    //   const tokens = {
    //     accessToken: response.accessToken,
    //     refreshToken: "", // Asignar vacío o manejar según tu lógica
    //     accessTokenExpiration: new Date(Date.now() + 3600 * 1000).toISOString(),
    //   };
    //   setTokens(tokens);
    // }

    showAnimatedAlert(response.data.message || "¡Mensaje enviado con éxito!", "success");
    setSubmitted(true);
  } catch (error) {
    console.error("Error en handleSubmit:", error);

    if (error instanceof z.ZodError) {
      const newErrors: { nombre?: string; email?: string; mensaje?: string; termsAccepted?: string } = {};
      error.issues.forEach((err) => {
        const field = err.path[0];
        if (field === "nombre" || field === "email" || field === "mensaje" || field === "termsAccepted") {
          newErrors[field] = err.message;
          showAnimatedAlert(`${field === "termsAccepted" ? "Términos y condiciones" : field.charAt(0).toUpperCase() + field.slice(1)}: ${err.message}`, "error");
        }
      });
      setErrors(newErrors);
    } else if (error instanceof Error) {
      if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        showAnimatedAlert("Sesión no autorizada. Refrescando token o redirigiendo a login.", "error");
        setTimeout(() => navigate("/login"), 2000);
        console.log("Redirigiendo a /login tras error de autenticación");
      } else if (error.message.includes("Datos inválidos")) {
        const errorDetails = error.message.split(", ").map((msg) => {
          const match = msg.match(/([^:]+): (.+)/);
          return match ? `${match[1].charAt(0).toUpperCase() + match[1].slice(1)}: ${match[2]}` : msg;
        });

        const newErrors: { nombre?: string; email?: string; mensaje?: string } = {};
        errorDetails.forEach((msg) => {
          showAnimatedAlert(msg, "error");
          const fieldMatch = msg.match(/(Nombre|Email|Mensaje): (.+)/);
          if (fieldMatch) {
            const field = fieldMatch[1].toLowerCase();
            if (field === "nombre" || field === "email" || field === "mensaje") {
              newErrors[field as "nombre" | "email" | "mensaje"] = fieldMatch[2];
            }
          }
        });

        setErrors(newErrors);
      } else {
        showAnimatedAlert(error.message || "Error desconocido", "error");
      }
    } else {
      showAnimatedAlert("Error desconocido", "error");
    }
  } finally {
    setIsSubmitting(false);
    console.log("Envío finalizado, isSubmitting:", false);
  }
};

  const validateField = (field: keyof Omit<ContactForm, "estado" | "termsAccepted">, value: string) => {
    try {
      contactSchema.pick({ [field]: true }).parse({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError && Array.isArray(error.issues) && error.issues.length > 0) {
        setErrors((prev) => ({ ...prev, [field]: error.issues[0].message }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: "Error de validación" }));
      }
    }
  };

  const showAnimatedAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
    console.log("Mostrando alerta:", { message, type });
  };

  const handleInputChange = (field: keyof ContactForm, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Validar solo si es un campo de string
    if (typeof value === "string") {
      validateField(field as keyof Omit<ContactForm, "estado" | "termsAccepted">, value);
    } else if (field === "termsAccepted") {
      // Validar checkbox específicamente
      try {
        contactSchema.pick({ termsAccepted: true }).parse({ termsAccepted: value });
        setErrors((prev) => ({ ...prev, termsAccepted: undefined }));
      } catch (error) {
        if (error instanceof z.ZodError && Array.isArray(error.issues) && error.issues.length > 0) {
          setErrors((prev) => ({ ...prev, termsAccepted: error.issues[0].message }));
        }
      }
    }
    
    if (submitted) setSubmitted(false);
    console.log("Cambio en campo:", { field, value });
  };

  const resetForm = () => {
    setSubmitted(false);
    setErrors({});
    setFormData({
      nombre: "",
      email: "",
      mensaje: "",
      estado: "pendiente",
      termsAccepted: false,
    });
    console.log("Formulario reseteado");
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Solicita una Demo</CardTitle>
        <CardDescription className="text-gray-300">
          Completa el formulario y te contactaremos en menos de 24 horas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-8 animate-fadeInUp">
            <div className="relative mb-6">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto animate-bounce" />
              <div className="absolute inset-0 w-20 h-20 bg-green-500/20 rounded-full mx-auto animate-ping"></div>
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 animate-slideInDown">¡Mensaje Enviado!</h3>
            <p className="text-gray-300 mb-6 animate-slideInUp">Te contactaremos pronto.</p>
            <Button
              onClick={resetForm}
              variant="outline"
              className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent hover:scale-105 transition-all duration-300"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Otro Mensaje
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-white flex items-center">
                <User className="w-4 h-4 mr-2 text-purple-400" />
                Nombre Completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 pl-10 pr-10 transition-all duration-300 ${
                    errors.nombre
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake"
                      : "focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  placeholder="Tu nombre completo"
                  required
                />
                {errors.nombre && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-4 h-4 text-red-500 animate-bounce" />
                  </div>
                )}
              </div>
              {errors.nombre && (
                <p className="text-red-400 text-xs mt-1 animate-slideInDown flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.nombre}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 pl-10 pr-10 transition-all duration-300 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake"
                      : "focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  placeholder="tu@empresa.com"
                  required
                />
                {errors.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-4 h-4 text-red-500 animate-bounce" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 animate-slideInDown flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensaje" className="text-white flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-green-400" />
                Mensaje
              </Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                <Textarea
                  id="mensaje"
                  value={formData.mensaje}
                  onChange={(e) => handleInputChange("mensaje", e.target.value)}
                  className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[120px] pl-10 pr-10 transition-all duration-300 ${
                    errors.mensaje
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake"
                      : "focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  placeholder="Cuéntanos sobre tu empresa y cómo podemos ayudarte..."
                  required
                />
                {errors.mensaje && (
                  <div className="absolute right-3 top-4">
                    <AlertCircle className="w-4 h-4 text-red-500 animate-bounce" />
                  </div>
                )}
              </div>
              {errors.mensaje && (
                <p className="text-red-400 text-xs mt-1 animate-slideInDown flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.mensaje}
                </p>
              )}
            </div>

            {/* Términos y Condiciones */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => {
                    const value = checked === true;
                    handleInputChange("termsAccepted", value);
                  }}
                  className={`mt-1 ${
                    errors.termsAccepted
                      ? "border-red-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 animate-shake"
                      : ""
                  }`}
                />
                <div className="flex-1">
                  <Label 
                    htmlFor="termsAccepted" 
                    className="text-sm text-gray-300 leading-relaxed cursor-pointer"
                  >
                    Acepto los{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/privacy")}
                      className="text-purple-400 hover:text-purple-300 underline transition-colors"
                    >
                      términos y condiciones
                    </button>{" "}
                    y la{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/privacy")}
                      className="text-purple-400 hover:text-purple-300 underline transition-colors"
                    >
                      política de privacidad
                    </button>
                  </Label>
                  {errors.termsAccepted && (
                    <p className="text-red-400 text-xs mt-1 animate-slideInDown flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.termsAccepted}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={isSubmitting || !formData.termsAccepted}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : !formData.termsAccepted ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Acepta los términos para continuar
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Solicitar Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>

      {/* Animated Alert */}
      {showAlert && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
            showAlert ? "animate-slideInDown opacity-100" : "animate-slideOutUp opacity-0"
          }`}
        >
          <div
            className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-sm border ${
              alertType === "success"
                ? "bg-green-500/20 border-green-500/50 text-green-300"
                : "bg-red-500/20 border-red-500/50 text-red-300"
            } animate-bounceIn`}
          >
            {alertType === "success" ? (
              <CheckCircle className="w-5 h-5 animate-pulse" />
            ) : (
              <AlertCircle className="w-5 h-5 animate-bounce" />
            )}
            <span className="font-medium">{alertMessage}</span>
            <button onClick={() => setShowAlert(false)} className="ml-2 hover:opacity-70 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}