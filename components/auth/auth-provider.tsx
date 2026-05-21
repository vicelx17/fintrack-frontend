"use client"

import { registerLogoutHandler } from "@/services/safe-fetch"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutos
const TOKEN_CHECK_INTERVAL = 60 * 1000 // cada minuto
const ACTIVITY_EVENTS = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"]

function parseJwtExpiry(token: string): number | null {
  try {
    const base64Payload = token.split(".")[1]
    if (!base64Payload) return null
    const payload = JSON.parse(atob(base64Payload))
    return payload.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  const expiry = parseJwtExpiry(token)
  if (!expiry) return true
  return Date.now() >= expiry
}

interface AuthProviderProps {
  children: React.ReactNode
  /** Si es true, activa la vigilancia (solo en páginas protegidas) */
  protected?: boolean
}

export function AuthProvider({ children, protected: isProtected = false }: AuthProviderProps) {
  const router = useRouter()
  const lastActivityRef = useRef<number>(Date.now())
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const tokenCheckTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isActive, setIsActive] = useState(true)

  const logout = useCallback(
    (reason: "inactivity" | "token_expired") => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
      if (tokenCheckTimerRef.current) clearInterval(tokenCheckTimerRef.current)

      localStorage.removeItem("fintrack_token")
      sessionStorage.setItem(
        "logout_reason",
        reason === "inactivity"
          ? "Tu sesión se cerró por inactividad (30 minutos)"
          : "Tu sesión ha expirado. Por favor, inicia sesión de nuevo"
      )

      setIsActive(false)
      router.replace("/")
    },
    [router]
  )

  const resetInactivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now()

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    inactivityTimerRef.current = setTimeout(() => {
      const token = localStorage.getItem("fintrack_token")
      if (token) logout("inactivity")
    }, INACTIVITY_TIMEOUT)
  }, [logout])

  const checkToken = useCallback(() => {
    const token = localStorage.getItem("fintrack_token")
    if (!token) {
      if (isProtected) router.replace("/")
      return
    }
    if (isTokenExpired(token)) {
      logout("token_expired")
    }
  }, [logout, router, isProtected])

  useEffect(() => {
    if (!isProtected) return

    // Registrar handler global para safeFetch
    registerLogoutHandler(() => logout("token_expired"))

    // Verificar token inmediatamente
    checkToken()

    // Iniciar timer de inactividad
    resetInactivityTimer()

    // Listeners de actividad
    const handleActivity = () => resetInactivityTimer()
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    // Check periódico del token
    tokenCheckTimerRef.current = setInterval(checkToken, TOKEN_CHECK_INTERVAL)

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
      if (tokenCheckTimerRef.current) clearInterval(tokenCheckTimerRef.current)
    }
  }, [isProtected, checkToken, resetInactivityTimer, logout])

  if (!isActive) return null

  return <>{children}</>
}