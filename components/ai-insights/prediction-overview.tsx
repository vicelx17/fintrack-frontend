import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function PredictionOverview() {
  const predictions = [
    {
      title: "Gasto Mensual Previsto",
      current: "€2,850",
      predicted: "€2,950",
      confidence: 92,
      trend: "up",
      change: "+3.5%",
      status: "warning",
      icon: TrendingUp,
    },
    {
      title: "Ahorro Proyectado",
      current: "€1,350",
      predicted: "€1,250",
      confidence: 88,
      trend: "down",
      change: "-7.4%",
      status: "alert",
      icon: Target,
    },
    {
      title: "Balance Fin de Mes",
      current: "€4,049",
      predicted: "€4,200",
      confidence: 85,
      trend: "up",
      change: "+3.7%",
      status: "good",
      icon: TrendingUp,
    },
    {
      title: "Riesgo Presupuestario",
      current: "Bajo",
      predicted: "Medio",
      confidence: 78,
      trend: "up",
      change: "Incremento",
      status: "warning",
      icon: AlertTriangle,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-primary"
      case "warning":
        return "text-secondary"
      case "alert":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="w-4 h-4 text-primary" />
      case "warning":
        return <Clock className="w-4 h-4 text-secondary" />
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {predictions.map((prediction, index) => {
        const Icon = prediction.icon

        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{prediction.title}</CardTitle>
              <div className="flex items-center space-x-2">
                {getStatusIcon(prediction.status)}
                <Icon className={`w-4 h-4 ${getStatusColor(prediction.status)}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="text-2xl font-bold">{prediction.predicted}</div>
                <div className="text-sm text-muted-foreground">Actual: {prediction.current}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Confianza</span>
                  <span className="font-medium">{prediction.confidence}%</span>
                </div>
                <Progress value={prediction.confidence} className="h-1" />
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {prediction.change}
                </Badge>
                <span className="text-xs text-muted-foreground">vs actual</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
