import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

const riskFactors = [
  {
    factor: "Volatilidad de Ingresos",
    level: 25,
    status: "Bajo",
    description: "Ingresos estables con poca variación mensual",
    trend: "down",
  },
  {
    factor: "Dependencia de Categoría",
    level: 60,
    status: "Medio",
    description: "Alto gasto concentrado en alimentación y vivienda",
    trend: "stable",
  },
  {
    factor: "Cumplimiento Presupuesto",
    level: 35,
    status: "Bajo",
    description: "Buen control de gastos dentro de límites establecidos",
    trend: "down",
  },
  {
    factor: "Reserva de Emergencia",
    level: 15,
    status: "Muy Bajo",
    description: "Fondo de emergencia sólido (6+ meses de gastos)",
    trend: "down",
  },
]

const overallRisk = {
  score: 34,
  level: "Bajo",
  description: "Tu situación financiera es estable con riesgos controlados",
}

export function RiskAnalysis() {
  const getRiskColor = (level: number) => {
    if (level <= 30) return "text-primary"
    if (level <= 60) return "text-secondary"
    return "text-destructive"
  }

  const getRiskBadgeColor = (status: string) => {
    switch (status) {
      case "Muy Bajo":
      case "Bajo":
        return "bg-primary/10 text-primary border-primary/20"
      case "Medio":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "Alto":
      case "Muy Alto":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-destructive" />
      case "down":
        return <TrendingDown className="w-3 h-3 text-primary" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <span>Análisis de Riesgo</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Risk Score */}
          <div className="p-4 rounded-lg border bg-card/50 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Puntuación General</h3>
              <Badge className={getRiskBadgeColor(overallRisk.level)}>{overallRisk.level}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Riesgo Financiero</span>
                <span className="font-medium">{overallRisk.score}/100</span>
              </div>
              <Progress value={overallRisk.score} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">{overallRisk.description}</p>
          </div>

          {/* Risk Factors */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Factores de Riesgo</h4>
            {riskFactors.map((risk, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{risk.factor}</span>
                    {getTrendIcon(risk.trend)}
                  </div>
                  <Badge className={getRiskBadgeColor(risk.status)} size="sm">
                    {risk.status}
                  </Badge>
                </div>
                <Progress value={risk.level} className="h-1" />
                <p className="text-xs text-muted-foreground">{risk.description}</p>
              </div>
            ))}
          </div>

          {/* Risk Mitigation Tips */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-primary">Recomendación</h4>
                <p className="text-xs text-primary/80 mt-1">
                  Considera diversificar tus fuentes de ingresos y mantén al menos 3 meses de gastos en tu fondo de
                  emergencia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
