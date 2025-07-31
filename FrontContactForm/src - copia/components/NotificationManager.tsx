"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import Notification from "./Notification"
import { GetNewContacts } from "@/api/services/contactService"
import type { IContacto } from "@/types/Contacto"

interface NotificationData {
  id: string
  message: string
  leadId: number
  timestamp: number
}

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [lastId, setLastId] = useState<number | null>(null)
  const [pollInterval, setPollInterval] = useState(10000) // 10 segundos inicial
  const [lastActivityTime, setLastActivityTime] = useState(Date.now())
  const [isPolling, setIsPolling] = useState(true)

  const lastIdRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Límite máximo de notificaciones visibles
  const MAX_NOTIFICATIONS = 3
  const NOTIFICATION_DURATION = 8000 // 8 segundos
  const INACTIVE_THRESHOLD = 5 * 60 * 1000 // 5 minutos
  const SLOW_POLL_INTERVAL = 30000 // 30 segundos

  // Función para generar ID único para notificaciones
  const generateNotificationId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Función para verificar duplicados
  const isDuplicateNotification = useCallback(
    (leadId: number) => {
      return notifications.some((notification) => notification.leadId === leadId)
    },
    [notifications],
  )

  // Función para añadir nueva notificación
  const addNotification = useCallback(
    (lead: IContacto) => {
      if (isDuplicateNotification(lead.id)) {
        console.log(`Notificación duplicada evitada para lead ID: ${lead.id}`)
        return
      }

      const newNotification: NotificationData = {
        id: generateNotificationId(),
        message: `${lead.nombre} acaba de enviar un mensaje`,
        leadId: lead.id,
        timestamp: Date.now(),
      }

      setNotifications((prev) => {
        const updated = [newNotification, ...prev]
        // Mantener solo las últimas MAX_NOTIFICATIONS
        return updated.slice(0, MAX_NOTIFICATIONS)
      })

      // Auto-remover después del tiempo especificado
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id))
      }, NOTIFICATION_DURATION)

      setLastActivityTime(Date.now())
    },
    [isDuplicateNotification],
  )

  // Función principal de polling
  const pollForNewLeads = useCallback(async () => {
    if (!isPolling) return

    try {
      console.log(`🔄 Polling para nuevos leads desde ID: ${lastIdRef.current || "inicio"}`)

      const response = await GetNewContacts(lastIdRef.current !== null ? lastIdRef.current : undefined)

      if (response?.status === 200 && Array.isArray(response.data)) {
        const newLeads = response.data.filter((lead: IContacto) => lead.id > (lastIdRef.current || 0))

        if (newLeads.length > 0) {
          console.log(`✅ ${newLeads.length} nuevos leads encontrados`)

          // Procesar cada nuevo lead
          newLeads.forEach((lead: IContacto) => {
            addNotification(lead)
          })

          // Actualizar el último ID procesado
          const latestLead = newLeads.reduce((latest, current) => (current.id > latest.id ? current : latest))

          setLastId(latestLead.id)
          lastIdRef.current = latestLead.id
          setLastActivityTime(Date.now())
        } else {
          console.log("📭 No hay nuevos leads")
        }
      } else {
        console.warn("⚠️ Respuesta inesperada del servidor:", response)
      }
    } catch (error) {
      console.error("❌ Error al obtener nuevos contactos:", error)

      // Reintentar después de un retraso en caso de error
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }

      retryTimeoutRef.current = setTimeout(() => {
        console.log("🔄 Reintentando después del error...")
        pollForNewLeads()
      }, 5000) // Reintentar en 5 segundos
    }
  }, [isPolling, addNotification])

  // Ajustar intervalo de polling basado en actividad
  useEffect(() => {
    const now = Date.now()
    const timeSinceLastActivity = now - lastActivityTime

    const newInterval = timeSinceLastActivity > INACTIVE_THRESHOLD ? SLOW_POLL_INTERVAL : 10000

    if (newInterval !== pollInterval) {
      setPollInterval(newInterval)
      console.log(`⏱️ Intervalo de polling ajustado a ${newInterval / 1000} segundos`)
    }
  }, [lastActivityTime, pollInterval])

  // Configurar polling con intervalo dinámico
  useEffect(() => {
    if (!isPolling) return

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Ejecutar inmediatamente
    pollForNewLeads()

    // Configurar intervalo
    intervalRef.current = setInterval(pollForNewLeads, pollInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [pollInterval, pollForNewLeads, isPolling])

  // Función para cerrar notificación específica
  const closeNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }, [])

  // Función para pausar/reanudar polling (útil para debugging)
  const togglePolling = useCallback(() => {
    setIsPolling((prev) => !prev)
    console.log(`🎛️ Polling ${!isPolling ? "activado" : "pausado"}`)
  }, [isPolling])

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Debug info - remover en producción */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded text-xs z-50">
          <div>Polling: {isPolling ? "🟢" : "🔴"}</div>
          <div>Intervalo: {pollInterval / 1000}s</div>
          <div>Último ID: {lastId || "N/A"}</div>
          <div>
            Notificaciones: {notifications.length}/{MAX_NOTIFICATIONS}
          </div>
          <button onClick={togglePolling} className="mt-1 px-2 py-1 bg-blue-600 rounded text-xs">
            {isPolling ? "Pausar" : "Reanudar"}
          </button>
        </div>
      )}

      {/* Contenedor de notificaciones */}
      <div className="fixed top-4 left-0 z-50 space-y-2">
        {notifications.map((notification, index) => (
          <Notification
            key={notification.id}
            message={notification.message}
            onClose={() => closeNotification(notification.id)}
            index={index}
          />
        ))}
      </div>
    </>
  )
}

export default NotificationManager
