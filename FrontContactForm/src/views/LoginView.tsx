"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  BarChart3,
  Mail,
  Lock,
  Chrome,
  Apple,
  Twitter,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { LoginAuth } from "@/api/services/authService"
import type { ILoginUser } from "@/types/Auth"

const loginSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ILoginUser>({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("error")

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Validar primero con Zod
      loginSchema.parse(formData)

      // Llamada real al API
      const response = await LoginAuth(formData, () => {})
      if (!response) {
        throw new Error("Error en el servidor")
      }

      showAnimatedAlert(response.data.message, "success")
      setTimeout(() => navigate("/Dashboard"), 1000)
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Errores de validación del frontend
        const newErrors: { username?: string; password?: string } = {}
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof typeof formData
          newErrors[field] = err.message
          showAnimatedAlert(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${err.message}`, "error")
        })
        setErrors(newErrors)
      } else if (error instanceof Error) {
        if (error.message.includes("Usuario no encontrado")) {
          showAnimatedAlert("Usuario no encontrado", "error")
          setErrors({ username: "Usuario no encontrado" })
        } else if (error.message.includes("Contraseña incorrecta")) {
          showAnimatedAlert("Contraseña incorrecta", "error")
          setErrors({ password: "Contraseña incorrecta" })
        } else if (error.message.includes("Datos inválidos")) {
          // Manejar errores de validación del backend
          const errorDetails = error.message.split(", ").map((msg) => {
            const match = msg.match(/([^:]+): (.+)/)
            return match ? `${match[1].charAt(0).toUpperCase() + match[1].slice(1)}: ${match[2]}` : msg
          })
          const newErrors: { username?: string; password?: string } = {}
          errorDetails.forEach((msg) => {
            showAnimatedAlert(msg, "error")
            const fieldMatch = msg.match(/(Username|Password): (.+)/)
            if (fieldMatch) {
              const field = fieldMatch[1].toLowerCase() as keyof typeof formData
              newErrors[field] = fieldMatch[2]
            }
          })
          setErrors(newErrors)
        } else {
          showAnimatedAlert(error.message, "error")
        }
      } else {
        showAnimatedAlert("Error desconocido", "error")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const validateField = (field: keyof typeof formData, value: string) => {
    try {
      loginSchema.pick({ [field]: true }).parse({ [field]: value })
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError && Array.isArray(error.issues) && error.issues.length > 0) {
        setErrors((prev) => ({ ...prev, [field]: error.issues[0].message }))
      } else {
        setErrors((prev) => ({ ...prev, [field]: "Error de validación" }))
      }
    }
  }

  const showAnimatedAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 4000)
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    validateField(field, value)
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // Implement social login logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Back Button */}
      <div onClick={() => navigate("/")} className="fixed top-6 left-6 z-50 group cursor-pointer">
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white bg-gray-800/50 backdrop-blur-sm">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al Inicio
        </Button>
      </div>

      {/* Logo */}
      <div className="fixed top-6 right-6 z-50 flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center animate-pulse">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold">CRMPro</span>
      </div>

      {/* Login Card */}
      <Card
        className={`w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-gray-700 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
        }`}
      >
        <CardHeader className="text-center pb-6">
          {/* User Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                <User className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-purple-500/10 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-gray-400 text-sm">Please enter your information to sign in</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Login Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 transition-all duration-300 hover:scale-105"
                onClick={() => handleSocialLogin("apple")}
              >
                <Apple className="w-5 h-5 text-white" />
              </Button>
              <Button
                variant="outline"
                className="bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 transition-all duration-300 hover:scale-105"
                onClick={() => handleSocialLogin("google")}
              >
                <Chrome className="w-5 h-5 text-white" />
              </Button>
              <Button
                variant="outline"
                className="bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 transition-all duration-300 hover:scale-105"
                onClick={() => handleSocialLogin("twitter")}
              >
                <Twitter className="w-5 h-5 text-blue-400" />
              </Button>
            </div>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800 px-2 text-gray-400">OR</span>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white text-sm">
                Username
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={`bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pl-10 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 ${
                    errors.username ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake" : ""
                  }`}
                  placeholder="Enter your username..."
                  required
                />
                {errors.username && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-4 h-4 text-red-500 animate-bounce" />
                  </div>
                )}
              </div>
              {errors.username && (
                <p className="text-red-400 text-xs mt-1 animate-slideInDown flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pl-10 pr-10 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 ${
                    errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake" : ""
                  }`}
                  placeholder="••••••••••"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  {errors.password && <AlertCircle className="w-4 h-4 text-red-500 animate-bounce" />}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 animate-slideInDown flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors underline"
                onClick={() => console.log("Forgot password clicked")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Don't have an account yet?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Features */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <button className="hover:text-gray-300 transition-colors">Privacy Policy</button>
          <span>•</span>
          <button className="hover:text-gray-300 transition-colors">Terms of Service</button>
          <span>•</span>
          <button className="hover:text-gray-300 transition-colors">Help</button>
        </div>
      </div>
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
    </div>
  )
}