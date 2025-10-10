"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useBudgets } from "@/hooks/use-budgets"
import { AlertTriangle, Loader2, Target, TrendingDown, TrendingUp } from "lucide-react"

export function BudgetOverview() {
  const { budgetOverview, loading } = useBudgets()

  if (loading.overview.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!budgetOverview) {
    return null
  }

  const overviewData = [
    {
      title: "Presupuesto Total",
      value: `€${budgetOverview.totalBudget.toFixed(2)}`,
      subtitle: "Este mes",
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Gastado",
      value: `€${budgetOverview.totalSpent.toFixed(2)}`,
      subtitle: `${budgetOverview.percentageUsed.toFixed(1)}% del presupuesto`,
      icon: TrendingDown,
      color: "text-secondary",
    },
    {
      title: "Disponible",
      value: `€${budgetOverview.available.toFixed(2)}`,
      subtitle: `${(100 - budgetOverview.percentageUsed).toFixed(1)}% restante`,
      icon: TrendingUp,
      color: budgetOverview.available > 0 ? "text-primary" : "text-destructive",
    },
    {
      title: "Presupuestos Excedidos",
      value: budgetOverview.budgetsExceeded.toString(),
      subtitle: `De ${budgetOverview.totalBudgets} categorías`,
      icon: AlertTriangle,
      color: budgetOverview.budgetsExceeded > 0 ? "text-destructive" : "text-primary",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewData.map((item, index) => {
          const Icon = item.icon

          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Presupuesto general</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Gastado</span>
              <span className="text-sm text-muted-foreground">
                €{budgetOverview.totalSpent.toFixed(2)} / €{budgetOverview.totalBudget.toFixed(2)}
              </span>
            </div>
            <Progress value={budgetOverview.percentageUsed} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{budgetOverview.percentageUsed.toFixed(1)}% usado</span>
              <span>€{budgetOverview.available.toFixed(2)} restante</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}