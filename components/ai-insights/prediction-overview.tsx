"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, AlertTriangle, CheckCircle, Clock, Brain } from "lucide-react"
import { useSpendingTrends, useRiskAnalysis, useSmartRecommendations } from "@/hooks/use-ai"

export function PredictionOverview() {
  const {trend, isLoading: trendLoading } = useSpendingTrends()
  const {analysis, isLoading: riskLoading } = useRiskAnalysis()
  const {recommendations, isLoading: recsLoading } = useSmartRecommendations()

  const isLoading = trendLoading || riskLoading || recsLoading

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-24" />
              <div className="h-2 bg-gray-200 rounded w-full" />
              <div className="h-5 bg-gray-200 rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  // Build predictions from real data
  const trendLabel = trend?.trend === "increasing"
    ? `+${trend.percentage?.toFixed(1)}%`
    : trend?.trend === "decreasing"
    ? `-${trend.percentage?.toFixed(1)}%`
    : "Estable"
 
  const trendStatus = trend?.trend === "increasing" ? "warning"
    : trend?.trend === "decreasing" ? "good"
    : "neutral"
 
  const riskScore = analysis?.overallScore ?? 0
  const riskLevel = analysis?.level ?? "Desconocido"
 
  const totalPotentialSavings = recommendations
    .filter(r => r.potentialSavings > 0)
    .reduce((sum, r) => sum + r.potentialSavings, 0)
 
  const actionableCount = recommendations.filter(r => r.actionable).length
 
  const predictions = [
    {
      title: "Tendencia de Gasto",
      current: trend?.message ?? "Sin datos",
      predicted: trendLabel,
      confidence: trend ? 80 : 0,
      status: trendStatus as "good" | "warning" | "alert" | "neutral",
      icon: TrendingUp,
    },
    {
      title: "Riesgo Financiero",
      current: riskLevel,
      predicted: `${riskScore.toFixed(0)}/100`,
      confidence: analysis ? 90 : 0,
      status: (riskScore <= 30 ? "good" : riskScore <= 60 ? "warning" : "alert") as "good" | "warning" | "alert",
      icon: Target,
    },
    {
      title: "Ahorro Potencial",
      current: `${recommendations.length} recomendaciones`,
      predicted: `€${totalPotentialSavings.toFixed(2)}/mes`,
      confidence: recommendations.length > 0 ? 85 : 0,
      status: totalPotentialSavings > 0 ? "good" : "neutral" as any,
      icon: CheckCircle,
    },
    {
      title: "Acciones Pendientes",
      current: "Recomendaciones IA",
      predicted: `${actionableCount} accionables`,
      confidence: recommendations.length > 0 ? 95 : 0,
      status: actionableCount > 2 ? "warning" : "good" as any,
      icon: AlertTriangle,
    },
  ]
 
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-primary"
      case "warning": return "text-secondary"
      case "alert": return "text-destructive"
      default: return "text-muted-foreground"
    }
  }
 
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="w-4 h-4 text-primary" />
      case "warning": return <Clock className="w-4 h-4 text-secondary" />
      case "alert": return <AlertTriangle className="w-4 h-4 text-destructive" />
      default: return <Brain className="w-4 h-4 text-muted-foreground" />
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
                <div className="text-sm text-muted-foreground truncate">{prediction.current}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Confianza</span>
                  <span className="font-medium">{prediction.confidence}%</span>
                </div>
                <Progress value={prediction.confidence} className="h-1" />
              </div>
              <Badge variant="outline" className="text-xs">
                Datos reales
              </Badge>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
