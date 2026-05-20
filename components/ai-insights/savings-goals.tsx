"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Brain } from "lucide-react"
import { useFinancialSummary } from "@/hooks/use-dashboard"
import { useSpendingPredictions } from "@/hooks/use-ai"

export function SavingsGoals() {
  const { data: summary, isLoading: summaryLoading } = useFinancialSummary()
  const { predictions, isLoading: predictionsLoading } = useSpendingPredictions("1month")

  const isLoading = summaryLoading || predictionsLoading

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Resumen de Ahorro IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-lg border space-y-3">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-2 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const monthlyIncome = summary?.monthly_income ?? 0
  const monthlyExpenses = summary?.monthly_expenses ?? 0
  const currentSaving = summary?.saving ?? 0
  const savingsRate = monthlyIncome > 0 ? (currentSaving / monthlyIncome) * 100 : 0

  // Calculate predicted saving based on spending predictions
  const predictedExpenseReduction = predictions.length > 0
    ? predictions.reduce((sum, p) => {
        const diff = p.current - p.predicted
        return sum + diff
      }, 0)
    : 0

  const projectedSaving = currentSaving + predictedExpenseReduction
  const targetRate = 20 // 20% savings rate goal
  const targetSaving = monthlyIncome * (targetRate / 100)
  const savingsGap = targetSaving - currentSaving

  const items = [
    {
      label: "Ahorro actual",
      value: `€${currentSaving.toFixed(2)}/mes`,
      detail: `${savingsRate.toFixed(1)}% de tus ingresos`,
      status: savingsRate >= 20 ? "good" : savingsRate >= 10 ? "warning" : "bad",
    },
    {
      label: "Ahorro proyectado IA",
      value: projectedSaving > currentSaving
        ? `€${projectedSaving.toFixed(2)}/mes`
        : `€${currentSaving.toFixed(2)}/mes`,
      detail: predictedExpenseReduction > 0
        ? `+€${predictedExpenseReduction.toFixed(2)} optimizando gastos`
        : "Sin cambios proyectados",
      status: projectedSaving >= targetSaving ? "good" : "warning",
    },
    {
      label: "Meta recomendada (20%)",
      value: `€${targetSaving.toFixed(2)}/mes`,
      detail: savingsGap > 0
        ? `Faltan €${savingsGap.toFixed(2)} para alcanzarla`
        : "¡Ya superas la meta!",
      status: currentSaving >= targetSaving ? "good" : "neutral",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good": return <Badge className="bg-primary/10 text-primary border-primary/20">Bien</Badge>
      case "warning": return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Mejorable</Badge>
      case "bad": return <Badge variant="destructive">Bajo</Badge>
      default: return <Badge variant="outline">Meta</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-primary" />
          <span>Resumen de Ahorro IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {monthlyIncome === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Brain className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Registra transacciones de ingresos para ver tu análisis de ahorro</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="p-4 rounded-lg border bg-card/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  {getStatusBadge(item.status)}
                </div>
                <div className="text-xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}

            {savingsGap > 0 && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-primary/80">
                <span className="font-medium">Consejo IA: </span>
                Reduciendo un 10% en tu categoría de mayor gasto podrías cerrar parte de esta brecha.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}