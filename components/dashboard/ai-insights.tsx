"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dashboardApi from "@/services/dashboard-api"
import { AlertTriangle, Brain, ChevronRight, Lightbulb, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

interface AIInsights {
  type: "prediction" | "warning" | "tip"
  title: string
  message: string
  confidence: "Alta" | "Media" | "Crítico"
  icon: string
  color: string
  amount?: number
  category?: string
}

const iconMap: { [key: string]: any } = {
  brain: Brain,
  "alert-triangle": AlertTriangle,
  lightbulb: Lightbulb,
}

const colorMap: { [key: string]: string } = {
  primary: "text-primary",
  destructive: "text-destructive",
  secondary: "text-secondary",
}

const badgeVariantMap: { [key: string]: "default" | "destructive" | "outline" | "secondary" } = {
  Alta: "default",
  Media: "secondary",
  Crítico: "destructive",
}

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsights[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadInsights = async (isRefresh: boolean = false) => {
    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      console.log("Cargando insights de IA...")
      const response = await dashboardApi.getAIInsights()
      console.log("Insights recibidos:", response)

      if (response && Array.isArray(response.insights)) {
        setInsights(response.insights)
      } else {
        setInsights([])
      }
    } catch (err) {
      console.error("Error cargando insights de IA:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")

      setInsights([
        {
          type: "tip",
          title: "Servicio temporalmente no disponible",
          message: "No se pudieron cargar los insights de IA. Por favor, inténtalo de nuevo más tarde.",
          confidence: "Crítico",
          icon: "alert-triangle",
          color: "destructive",
        },
      ])
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadInsights()
  }, [])

  const handleRefresh = () => {
    loadInsights(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-primary" />
          <span>Insights IA</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="h-8 w-8"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && !isRefreshing && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg border animate-pulse">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="space-y-4">
            {insights.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No hay insights disponibles</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Registra más transacciones para obtener análisis personalizados
                </p>
              </div>
            ) : (
              insights.map((insight, index) => {
                const IconComponent = iconMap[insight.icon] || Brain
                const colorClass = colorMap[insight.color] || "text-primary"
                const badgeVariant = badgeVariantMap[insight.confidence] || "default"

                return (
                  <div
                    key={index}
                    className="p-3 rounded-lg border bg-card/50 space-y-2 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`w-4 h-4 ${colorClass} flex-shrink-0`} />
                        <span className="font-medium text-sm">{insight.title}</span>
                      </div>
                      <Badge variant={badgeVariant} className="text-xs">
                        {insight.confidence}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insight.message}
                    </p>
                    
                    {(insight.amount || insight.category) && (
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {insight.amount && (
                          <span className="font-semibold text-foreground">
                            €{insight.amount.toFixed(2)}
                          </span>
                        )}
                        {insight.category && (
                          <Badge variant="outline" className="text-xs">
                            {insight.category}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between p-2 h-auto"
                    >
                      <span className="text-xs">Ver detalles</span>
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        )}

        {error && !isLoading && insights.length === 0 && (
          <div className="text-center py-4">
            <AlertTriangle className="w-8 h-8 mx-auto text-destructive mb-2" />
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-2"
            >
              Reintentar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}