// Authentication utilities and API integration
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  username: string
  role: "user" | "admin"
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  role?: "user" | "admin"
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

const API_BASE_URL = "http://localhost:8000"

export class AuthService {
  private static token: string | null = null

  static setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("fintrack_token", token)
    }
  }

  static getToken(): string | null {
    if (this.token) return this.token

    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("fintrack_token")
    }

    return this.token
  }

  static removeToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("fintrack_token")
    }
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      // AGREGAMOS LOGGING PARA DEBUG
      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      const data = await response.json()
      
      // LOGGING DE LA RESPUESTA REAL
      console.log("API Response data:", data)

      // Si la respuesta HTTP es exitosa (200-299)
      if (response.ok) {
        // Verificar si tiene token directamente (sin campo success)
        if (data.access_token || data.token) {
          const token = data.access_token || data.token
          this.setToken(token)
          
          return {
            success: true,
            token: token,
            user: data.user,
            message: "Login exitoso"
          }
        }
        
        // Si tiene estructura con success
        if (data.success && (data.token || data.access_token)) {
          const token = data.token || data.access_token
          this.setToken(token)
          return data
        }

        // Si no tiene token pero la respuesta fue OK
        return {
          success: false,
          message: "Respuesta exitosa pero sin token"
        }
      }

      // Si la respuesta HTTP no fue exitosa
      return {
        success: false,
        message: data.message || data.detail || "Error de autenticación"
      }

    } catch (error) {
      console.error("Network error:", error)
      return {
        success: false,
        message: "Error de conexión. Inténtalo de nuevo.",
      }
    }
  }

  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Mapear los datos del frontend a lo que espera la API
      const requestData = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: "user"
      }

      console.log("Sending registration data:", requestData)

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      // AGREGAMOS LOGGING PARA DEBUG
      console.log("Registration response status:", response.status)
      console.log("Registration response ok:", response.ok)

      const data = await response.json()
      
      // LOGGING DE LA RESPUESTA REAL
      console.log("Registration API Response data:", data)

      if (response.ok) {
        if (data.access_token || data.token) {
          const token = data.access_token || data.token
          this.setToken(token)
          
          return {
            success: true,
            token: token,
            user: data.user,
            message: "Registro exitoso"
          }
        }
        
        if (data.success && (data.token || data.access_token)) {
          const token = data.token || data.access_token
          this.setToken(token)
          return data
        }

        // Si no tiene token pero la respuesta fue OK
        return {
          success: false,
          message: "Respuesta exitosa pero sin token"
        }
      }

      return {
        success: false,
        message: data.message || data.detail || "Error en el registro"
      }

    } catch (error) {
      console.error("Network error during registration:", error)
      return {
        success: false,
        message: "Error de conexión. Inténtalo de nuevo.",
      }
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const token = this.getToken()
    if (!token) return null

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.user || data
      }
    } catch (error) {
      console.error("Error fetching current user:", error)
    }

    return null
  }

  static async logout(): Promise<void> {
    const token = this.getToken()

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error("Error during logout:", error)
      }
    }

    this.removeToken()
  }

  static async refreshToken(): Promise<boolean> {
    const token = this.getToken()
    if (!token) return false

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const newToken = data.token || data.access_token
        if (newToken) {
          this.setToken(newToken)
          return true
        }
      }
    } catch (error) {
      console.error("Error refreshing token:", error)
    }

    return false
  }
}