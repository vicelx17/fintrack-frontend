"use client"

/**
 * safeFetch: wrapper sobre fetch que captura errores de autenticación
 * y redirige silenciosamente en lugar de mostrar errores al usuario.
 */

type FetchOptions = RequestInit & {
  suppressAuthErrors?: boolean
}

let globalLogoutHandler: (() => void) | null = null

export function registerLogoutHandler(handler: () => void) {
  globalLogoutHandler = handler
}

export async function safeFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { suppressAuthErrors = true, ...fetchOptions } = options

  try {
    const response = await fetch(url, fetchOptions)

    // Si el token expiró (401) o no autorizado, redirigir silenciosamente
    if (response.status === 401 && suppressAuthErrors) {
      localStorage.removeItem("fintrack_token")
      sessionStorage.setItem("logout_reason", "Tu sesión ha expirado")

      if (globalLogoutHandler) {
        globalLogoutHandler()
      } else if (typeof window !== "undefined") {
        window.location.replace("/")
      }

      // Devolver una respuesta "vacía" para que el código que llama no explote
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return response
  } catch (error) {
    // Error de red (backend caído, CORS, etc.)
    if (suppressAuthErrors) {
      // Devolver respuesta de error controlada en lugar de lanzar excepción
      return new Response(
        JSON.stringify({ error: "network_error", detail: "No se pudo conectar con el servidor" }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      )
    }
    throw error
  }
}