import type React from "react"
import { useState, useEffect } from "react"
import { X, Bell, User } from "lucide-react"

interface NotificationProps {
  message: string
  onClose: () => void
  index?: number
}

const Notification: React.FC<NotificationProps> = ({ message, onClose, index = 0 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Trigger entrada con pequeño delay para animación escalonada
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 150)

    return () => clearTimeout(timer)
  }, [index])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300) // Duración de la animación de salida
  }

  return (
    <>
      <style>{`
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutToLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes scrollText {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.4);
          }
        }

        .notification-container {
          animation: ${isVisible && !isClosing ? "slideInFromLeft" : "none"} 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .notification-closing {
          animation: slideOutToLeft 0.3s ease-in-out forwards;
        }

        .scrolling-text {
          animation: scrollText 8s linear infinite;
          white-space: nowrap;
        }

        .notification-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .bell-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`notification-container ${isClosing ? "notification-closing" : ""} 
          w-96 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 
          text-white rounded-r-2xl shadow-2xl transform transition-all duration-300 
          hover:scale-105 notification-glow border-l-4 border-green-300`}
        style={{
          transform: isVisible ? "translateX(0)" : "translateX(-100%)",
          marginTop: `${index * 8}px`,
        }}
      >
        {/* Header con icono */}
        <div className="flex items-center justify-between p-3 bg-black/10 rounded-tr-2xl">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 bell-pulse" />
            <span className="text-sm font-semibold">Nuevo Lead</span>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-all duration-200 hover:rotate-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>

            {/* Contenedor del texto que se desliza */}
            <div className="flex-1 overflow-hidden relative">
              <div className="scrolling-text text-sm font-medium">{message}</div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-3 w-full bg-white/20 rounded-full h-1">
            <div
              className="bg-white h-1 rounded-full transition-all duration-8000 ease-linear"
              style={{
                width: isVisible ? "0%" : "100%",
                animation: isVisible ? "progress 8s linear forwards" : "none",
              }}
            />
          </div>
        </div>

        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-pulse" />
      </div>

      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </>
  )
}

export default Notification
