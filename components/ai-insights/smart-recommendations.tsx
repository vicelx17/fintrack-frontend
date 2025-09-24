"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingDown, Target, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react"

const recommendations = [
  {
    id: "1",
    type: "savings",
    title: "Optimiza Transporte",
    description: "Podrías ahorrar €150/mes usando transporte público 3 días a la semana",
    impact: "Alto",
    effort: "Bajo",
    savings: 150,
    icon: TrendingDown,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "2",
    type: "budget",
    title: "Ajusta Entretenimiento",
    description: "Tu gasto en entretenimiento aumentó 40% este mes. Considera establecer un límite semanal",
    impact: "Medio",
    effort: "Bajo",
    savings: 80,
    icon: Target,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    id: "3",
    type: "alert",
    title: "Revisa Suscripciones",
    description: "Detectamos 3 suscripciones inactivas que podrías cancelar",
    impact: "Medio",
    effort: "Muy Bajo",
    savings: 45,
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    id: "4",
    type: "goal",
    title: "Meta de Ahorro",
    description: "Estás en camino de superar tu meta de ahorro mensual en €200",
    impact: "Alto",
    effort: "Ninguno",
    savings: 0,
    icon: CheckCircle,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]

export function SmartRecommendations() {
  const handleApplyRecommendation = (recommendationId: string) => {
    console.log("Apply recommendation:", recommendationId)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Alto":
        return "bg-primary text-primary-foreground"
      case "Medio":
        return "bg-secondary text-secondary-foreground"
      case "Bajo":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
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
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const Icon = rec.icon

            return (
              <div key={rec.id} className="p-4 rounded-lg border bg-card/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${rec.bgColor}`}>
                      <Icon className={`w-4 h-4 ${rec.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{rec.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getImpactColor(rec.impact)} size="sm">
                      {rec.impact}
                    </Badge>
                    {rec.savings > 0 && (
                      <Badge variant="outline" size="sm">
                        €{rec.savings}/mes
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2"
                    onClick={() => handleApplyRecommendation(rec.id)}
                  >
                    <span className="text-xs">Aplicar</span>
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
