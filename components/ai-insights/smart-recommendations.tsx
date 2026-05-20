"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingDown, Target, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react"
import { useSmartRecommendations } from "@/hooks/use-ai"
import { AIInsightsService } from "@/services/ai-insights"
import { useToast } from "@/hooks/use-toast"

const typeIconMap: Record<string, any> = {
  savings: TrendingDown,
  budget: Target,
  alert: AlertTriangle,
  goal: CheckCircle,
}

const typeColorMap: Record<string, { color: string; bgColor: string }> = {
  savings: { color: "text-primary", bgColor: "bg-primary/10" },
  budget: { color: "text-secondary", bgColor: "bg-secondary/10" },
  alert: { color: "text-destructive", bgColor: "bg-destructive/10" },
  goal: { color: "text-primary", bgColor: "bg-primary/10" },
}

const impactColorMap: Record<string, string> = {
  Alto: "bg-primary text-primary-foreground",
  Medio: "bg-secondary text-secondary-foreground",
  Bajo: "bg-muted text-muted-foreground",
}

export function SmartRecommendations() {
  const { recommendations, isLoading, refresh } = useSmartRecommendations()
  const { toast } = useToast()

  const handleApplyRecommendation = async (recommendationId: string) => {
    try {
      const success = await AIInsightsService.refreshAIAnalysis()
      if (success) {
        toast({
          title: "Recomendación aplicada",
          description: "Se ha marcado como aplicada y el análisis se actualizará.",
        })
        refresh()
      }
    } catch {
      toast({
        title: "Error",
        description: "No se pudo aplicar la recomendación",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <span>Recomendaciones IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border animate-pulse space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && recommendations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>No hay recomendaciones disponibles</p>
            <p className="text-sm mt-1">Registra más transacciones para obtener consejos personalizados</p>
          </div>
        )}

        {!isLoading && recommendations.length > 0 && (
          <div className="space-y-4">
            {recommendations.map((rec) => {
              const Icon = typeIconMap[rec.type] ?? Lightbulb
              const colors = typeColorMap[rec.type] ?? typeColorMap.savings

              return (
                <div key={rec.id} className="p-4 rounded-lg border bg-card/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${colors.bgColor}`}>
                        <Icon className={`w-4 h-4 ${colors.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{rec.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={impactColorMap[rec.impact] ?? impactColorMap.Bajo}>
                        {rec.impact}
                      </Badge>
                      {rec.potentialSavings > 0 && (
                        <Badge variant="outline" className="text-xs">
                          €{rec.potentialSavings.toFixed(2)}/mes
                        </Badge>
                      )}
                      {rec.category && (
                        <Badge variant="outline" className="text-xs">
                          {rec.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}