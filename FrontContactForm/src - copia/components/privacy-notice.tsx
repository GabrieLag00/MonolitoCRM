"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Lock,
  Database,
  Users,
  Eye,
  Globe,
  CheckCircle,
  ArrowLeft,
  Mail,
  Phone,
  Building,
  BarChart3,
  Cookie,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function PrivacyPage() {
    const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]")
      const scrollPosition = window.scrollY + 200

      sections.forEach((section) => {
        const element = section as HTMLElement
        const offsetTop = element.offsetTop
        const height = element.offsetHeight

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
          setActiveSection(element.dataset.section || "")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const sections = [
    { id: "overview", title: "Resumen", icon: Eye },
    { id: "data-collection", title: "Recopilación", icon: Database },
    { id: "data-usage", title: "Uso de Datos", icon: Users },
    { id: "security", title: "Seguridad", icon: Lock },
    { id: "rights", title: "Tus Derechos", icon: Shield },
    { id: "cookies", title: "Cookies", icon: Cookie },
    { id: "contact", title: "Contacto", icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate("/")} className="flex items-center space-x-2 group">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Volver
              </Button>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center animate-pulse">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CRMPro</span>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block w-64 fixed left-0 top-20 h-full p-6 z-40">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
            <h3 className="font-semibold text-white mb-4">Navegación</h3>
            <nav className="space-y-2">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 group ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                      : "hover:bg-gray-700/50"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible ? "slideInLeft 0.6s ease-out forwards" : "none",
                  }}
                >
                  <section.icon
                    className={`w-4 h-4 transition-colors ${
                      activeSection === section.id ? "text-purple-400" : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  <span
                    className={`text-sm transition-colors ${
                      activeSection === section.id ? "text-white" : "text-gray-300 group-hover:text-white"
                    }`}
                  >
                    {section.title}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Header */}
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <Shield className="w-16 h-16 text-purple-400 animate-bounce" />
                  <div className="absolute inset-0 w-16 h-16 bg-purple-500/20 rounded-full animate-ping"></div>
                </div>
              </div>

              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Aviso de Privacidad
              </h1>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Tu privacidad es nuestra prioridad. Conoce cómo protegemos y utilizamos tu información.
              </p>

              <Badge className="mt-4 bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse">
                Última actualización: Enero 2024
              </Badge>
            </div>

            {/* Overview Section */}
            <section
              id="overview"
              data-section="overview"
              className={`mb-16 transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Eye className="w-6 h-6 text-blue-400 animate-pulse" />
                    <CardTitle className="text-2xl text-white">Resumen Ejecutivo</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    En CRMPro, valoramos tu privacidad y nos comprometemos a proteger tu información personal. Este
                    aviso explica de manera transparente cómo recopilamos, utilizamos y protegemos tus datos cuando
                    utilizas nuestra plataforma CRM empresarial.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {[
                      { icon: Users, label: "10,000+", desc: "Empresas protegidas" },
                      { icon: Shield, label: "99.9%", desc: "Tiempo de actividad seguro" },
                      { icon: Globe, label: "50+", desc: "Países con cumplimiento" },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="text-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-all duration-300 hover:scale-110"
                        style={{
                          animationDelay: `${(index + 1) * 200}ms`,
                          animation: isVisible ? "fadeInUp 0.8s ease-out forwards" : "none",
                        }}
                      >
                        <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-bounce" />
                        <div className="text-2xl font-bold text-white">{stat.label}</div>
                        <div className="text-sm text-gray-400">{stat.desc}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Data Collection Section */}
            <section
              id="data-collection"
              data-section="data-collection"
              className={`mb-16 transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-500 group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Database className="w-6 h-6 text-green-400 group-hover:animate-spin" />
                    <CardTitle className="text-2xl text-white">Información que Recopilamos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Datos Personales",
                        items: [
                          "Nombre y apellidos",
                          "Dirección de email",
                          "Número de teléfono",
                          "Información de la empresa",
                        ],
                        color: "purple",
                      },
                      {
                        title: "Datos de Uso",
                        items: [
                          "Actividad en la plataforma",
                          "Preferencias de usuario",
                          "Registros de comunicación",
                          "Métricas de rendimiento",
                        ],
                        color: "blue",
                      },
                    ].map((category, index) => (
                      <div
                        key={index}
                        className={`p-6 rounded-lg border transition-all duration-500 hover:scale-105 ${
                          category.color === "purple"
                            ? "bg-purple-500/10 border-purple-500/30 hover:border-purple-400"
                            : "bg-blue-500/10 border-blue-500/30 hover:border-blue-400"
                        }`}
                      >
                        <h3 className="font-semibold text-white mb-4 flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${
                              category.color === "purple" ? "bg-purple-400" : "bg-blue-400"
                            } animate-pulse`}
                          ></div>
                          {category.title}
                        </h3>
                        <ul className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Data Usage Section */}
            <section
              id="data-usage"
              data-section="data-usage"
              className={`mb-16 transition-all duration-1000 delay-400 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-orange-500/50 transition-all duration-500">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6 text-orange-400 animate-pulse" />
                    <CardTitle className="text-2xl text-white">Cómo Utilizamos tu Información</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "Proporcionar servicios CRM personalizados y eficientes",
                      "Mejorar continuamente la funcionalidad de nuestra plataforma",
                      "Brindar soporte técnico especializado y comunicaciones relevantes",
                      "Generar análisis y reportes agregados para insights empresariales",
                      "Garantizar el cumplimiento legal y mantener la seguridad del sistema",
                    ].map((usage, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-600/30 transition-all duration-300 hover:translate-x-2"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: isVisible ? "slideInRight 0.6s ease-out forwards" : "none",
                        }}
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{usage}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Security Section */}
            <section
              id="security"
              data-section="security"
              className={`mb-16 transition-all duration-1000 delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/30 hover:border-red-400/50 transition-all duration-500">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Lock className="w-6 h-6 text-red-400 animate-bounce" />
                    <CardTitle className="text-2xl text-white">Medidas de Seguridad</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { icon: Shield, title: "Encriptación SSL/TLS", desc: "Protección de extremo a extremo" },
                      { icon: Database, title: "Servidores SOC 2", desc: "Certificación de seguridad empresarial" },
                      { icon: Lock, title: "Autenticación 2FA", desc: "Acceso restringido y verificado" },
                      { icon: Eye, title: "Monitoreo 24/7", desc: "Vigilancia continua de seguridad" },
                    ].map((security, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-800/40 rounded-lg hover:bg-gray-700/40 transition-all duration-300 hover:scale-105"
                        style={{
                          animationDelay: `${index * 150}ms`,
                          animation: isVisible ? "zoomIn 0.8s ease-out forwards" : "none",
                        }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <security.icon className="w-6 h-6 text-white animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white mb-1">{security.title}</h3>
                          <p className="text-sm text-gray-400">{security.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Rights Section */}
            <section
              id="rights"
              data-section="rights"
              className={`mb-16 transition-all duration-1000 delay-600 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-500">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-green-400 animate-pulse" />
                    <CardTitle className="text-2xl text-white">Tus Derechos de Privacidad</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Acceso completo a todos tus datos personales almacenados",
                      "Rectificación inmediata de información incorrecta o desactualizada",
                      "Eliminación total de datos (derecho al olvido digital)",
                      "Portabilidad de datos en formatos estándar",
                      "Oposición al procesamiento para fines específicos",
                    ].map((right, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all duration-300 hover:translate-x-2"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: isVisible ? "slideInLeft 0.6s ease-out forwards" : "none",
                        }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 animate-pulse" />
                        <p className="text-gray-300">{right}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Cookies Section */}
            <section
              id="cookies"
              data-section="cookies"
              className={`mb-16 transition-all duration-1000 delay-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-500">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Cookie className="w-6 h-6 text-yellow-400 animate-spin" />
                    <CardTitle className="text-2xl text-white">Política de Cookies</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { type: "Esenciales", color: "green", desc: "Necesarias para el funcionamiento básico" },
                      { type: "Analíticas", color: "blue", desc: "Nos ayudan a mejorar nuestros servicios" },
                      { type: "Funcionales", color: "purple", desc: "Permiten funciones avanzadas y personalización" },
                    ].map((cookie, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border transition-all duration-500 hover:scale-110 ${
                          cookie.color === "green"
                            ? "bg-green-500/10 border-green-500/30"
                            : cookie.color === "blue"
                              ? "bg-blue-500/10 border-blue-500/30"
                              : "bg-purple-500/10 border-purple-500/30"
                        }`}
                        style={{
                          animationDelay: `${index * 200}ms`,
                          animation: isVisible ? "bounceIn 0.8s ease-out forwards" : "none",
                        }}
                      >
                        <h3
                          className={`font-semibold mb-2 ${
                            cookie.color === "green"
                              ? "text-green-300"
                              : cookie.color === "blue"
                                ? "text-blue-300"
                                : "text-purple-300"
                          }`}
                        >
                          {cookie.type}
                        </h3>
                        <p className="text-sm text-gray-400">{cookie.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Contact Section */}
            <section
              id="contact"
              data-section="contact"
              className={`mb-16 transition-all duration-1000 delay-800 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30 hover:border-purple-400/50 transition-all duration-500">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-6 h-6 text-purple-400 animate-bounce" />
                    <CardTitle className="text-2xl text-white">Contacto para Privacidad</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Si tienes preguntas sobre este aviso de privacidad o deseas ejercer tus derechos, nuestro equipo
                    especializado está disponible para ayudarte.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { icon: Mail, label: "Email", value: "privacidad@crmPro.com", color: "purple" },
                      { icon: Phone, label: "Teléfono", value: "+1 (555) 123-4567 ext. 101", color: "blue" },
                      { icon: Building, label: "Dirección", value: "123 Business Ave, Tech City", color: "green" },
                    ].map((contact, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border transition-all duration-500 hover:scale-105 ${
                          contact.color === "purple"
                            ? "bg-purple-500/10 border-purple-500/30 hover:border-purple-400"
                            : contact.color === "blue"
                              ? "bg-blue-500/10 border-blue-500/30 hover:border-blue-400"
                              : "bg-green-500/10 border-green-500/30 hover:border-green-400"
                        }`}
                        style={{
                          animationDelay: `${index * 150}ms`,
                          animation: isVisible ? "fadeInUp 0.8s ease-out forwards" : "none",
                        }}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <contact.icon
                            className={`w-5 h-5 ${
                              contact.color === "purple"
                                ? "text-purple-400"
                                : contact.color === "blue"
                                  ? "text-blue-400"
                                  : "text-green-400"
                            } animate-pulse`}
                          />
                          <span className="font-semibold text-white">{contact.label}</span>
                        </div>
                        <p className="text-sm text-gray-300">{contact.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Compliance Badge */}
            <div
              className={`text-center transition-all duration-1000 delay-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600 rounded-full px-8 py-4 hover:scale-105 transition-transform duration-300">
                <Globe className="w-6 h-6 text-blue-400 animate-spin" />
                <span className="text-white font-semibold">Cumplimiento Global</span>
                <div className="flex space-x-2">
                  {["GDPR", "CCPA", "LGPD"].map((compliance, index) => (
                    <Badge
                      key={compliance}
                      className="bg-green-500/20 text-green-300 border-green-500/30 animate-pulse"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      {compliance}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
