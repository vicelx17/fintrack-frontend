import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, AlertTriangle, Lightbulb, ChevronRight } from "lucide-react"

const insights = [
  {
    type: "prediction",
    title: "Predicción de Gastos",
    message: "Basado en tu patrón, gastarás ~€2,950 este mes",
    confidence: "Alta",
    icon: Brain,
    color: "text-primary",
  },
  {
    type: "warning",
    title: "Alerta de Presupuesto",
    message: "Entretenimiento excedió el límite en €20",
    confidence: "Crítico",
    icon: AlertTriangle,
    color: "text-destructive",
  },
  {
    type: "tip",
    title: "Oportunidad de Ahorro",
    message: "Podrías ahorrar €150/mes optimizando transporte",
    confidence: "Media",
    icon: Lightbulb,
    color: "text-secondary",
  },
]

export function AIInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-primary" />
          <span>Insights IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon

            return (
              <div key={index} className="p-3 rounded-lg border bg-card/50 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${insight.color}`} />
                    <span className="font-medium text-sm">{insight.title}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.message}</p>
                <Button variant="ghost" size="sm" className="w-full justify-between p-2">
                  <span className="text-xs">Ver detalles</span>
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
