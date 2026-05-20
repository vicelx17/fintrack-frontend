"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRiskAnalysis } from "@/hooks/use-ai"

export function RiskAnalysis() {
  const { analysis, isLoading, refresh } = useRiskAnalysis()

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Análisis de Riesgo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="p-4 rounded-lg border space-y-3">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-2 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-48" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-40" />
                <div className="h-1 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Análisis de Riesgo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-3">
            <Shield className="w-10 h-10 mx-auto text-muted-foreground opacity-40" />
            <p className="text-muted-foreground text-sm">
              No hay suficientes datos para calcular el riesgo financiero
            </p>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const riskFactors = [
    {
      factor: "Volatilidad de Ingresos",
      level: analysis.factors.incomeVolatility,
      status: analysis.factors.incomeVolatility <= 30 ? "Bajo" : analysis.factors.incomeVolatility <= 60 ? "Medio" : "Alto",
      description: analysis.factors.incomeVolatility <= 30
        ? "Ingresos estables con poca variación"
        : "Variabilidad detectada en tus ingresos",
      trend: analysis.factors.incomeVolatility <= 40 ? "down" : "up",
    },
    {
      factor: "Concentración de Gastos",
      level: analysis.factors.expenseConcentration,
      status: analysis.factors.expenseConcentration <= 30 ? "Bajo" : analysis.factors.expenseConcentration <= 60 ? "Medio" : "Alto",
      description: analysis.factors.expenseConcentration > 40
        ? "Alto gasto concentrado en pocas categorías"
        : "Gastos bien distribuidos entre categorías",
      trend: analysis.factors.expenseConcentration > 50 ? "up" : "down",
    },
    {
      factor: "Cumplimiento Presupuesto",
      level: 100 - analysis.factors.budgetCompliance,
      status: analysis.factors.budgetCompliance >= 80 ? "Bajo" : analysis.factors.budgetCompliance >= 60 ? "Medio" : "Alto",
      description: analysis.factors.budgetCompliance >= 80
        ? "Buen control dentro de los límites establecidos"
        : "Algunos presupuestos están siendo excedidos",
      trend: analysis.factors.budgetCompliance >= 70 ? "down" : "up",
    },
    {
      factor: "Fondo de Emergencia",
      level: 100 - analysis.factors.emergencyFund,
      status: analysis.factors.emergencyFund >= 80 ? "Muy Bajo" : analysis.factors.emergencyFund >= 50 ? "Bajo" : analysis.factors.emergencyFund >= 30 ? "Medio" : "Alto",
      description: analysis.factors.emergencyFund >= 80
        ? "Fondo de emergencia sólido (6+ meses)"
        : "Considera aumentar tu fondo de emergencia",
      trend: analysis.factors.emergencyFund >= 50 ? "down" : "up",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <span>Análisis de Riesgo</span>
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={refresh}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Risk Score */}
          <div className="p-4 rounded-lg border bg-card/50 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Puntuación General</h3>
              <Badge className={getRiskBadgeColor(analysis.level)}>{analysis.level}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Riesgo Financiero</span>
                <span className="font-medium">{analysis.overallScore.toFixed(0)}/100</span>
              </div>
              <Progress value={analysis.overallScore} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              {analysis.overallScore <= 30
                ? "Tu situación financiera es estable con riesgos controlados"
                : analysis.overallScore <= 60
                ? "Situación financiera con algunos puntos a mejorar"
                : "Atención: hay factores de riesgo importantes a gestionar"}
            </p>
          </div>

          {/* Risk Factors */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Factores de Riesgo</h4>
            {riskFactors.map((risk, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{risk.factor}</span>
                    {risk.trend === "up"
                      ? <TrendingUp className="w-3 h-3 text-destructive" />
                      : <TrendingDown className="w-3 h-3 text-primary" />}
                  </div>
                  <Badge className={getRiskBadgeColor(risk.status)}>
                    {risk.status}
                  </Badge>
                </div>
                <Progress value={risk.level} className="h-1" />
                <p className="text-xs text-muted-foreground">{risk.description}</p>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-primary">Recomendaciones</h4>
                  <ul className="mt-1 space-y-1">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-primary/80">• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}