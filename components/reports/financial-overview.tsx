import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FinancialSummary } from "@/services/reports-api"
import { CreditCard, DollarSign, PiggyBank, Target, TrendingDown, TrendingUp } from "lucide-react"

interface FinancialOverviewProps {
  summary: FinancialSummary | null
  isLoading?: boolean
}

export function FinancialOverview({ summary, isLoading }: FinancialOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No hay datos disponibles</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const overviewData = [
    {
      title: "Ingresos Totales",
      value: `€${summary.totalIncome.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+8.2%",
      trend: "up" as const,
      icon: TrendingUp,
      period: summary.period,
    },
    {
      title: "Gastos Totales",
      value: `€${summary.totalExpenses.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "-3.1%",
      trend: "down" as const,
      icon: TrendingDown,
      period: summary.period,
    },
    {
      title: "Balance Neto",
      value: `€${summary.netBalance.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+15.3%",
      trend: summary.netBalance >= 0 ? "up" as const : "down" as const,
      icon: DollarSign,
      period: summary.period,
    },
    {
      title: "Tasa de Ahorro",
      value: `${summary.savingsRate.toFixed(1)}%`,
      change: "+2.8%",
      trend: "up" as const,
      icon: PiggyBank,
      period: "Promedio mensual",
    },
    {
      title: "Gasto Promedio Diario",
      value: `€${summary.averageDailySpending.toFixed(2)}`,
      change: "-1.2%",
      trend: "down" as const,
      icon: CreditCard,
      period: summary.period,
    },
    {
      title: "Cumplimiento Presupuesto",
      value: `${summary.budgetCompliance.toFixed(1)}%`,
      change: "+5.1%",
      trend: "up" as const,
      icon: Target,
      period: "Este mes",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {overviewData.map((item, index) => {
        const Icon = item.icon
        const isPositive = item.trend === "up"

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
              <div className={`p-2 rounded-lg ${isPositive ? "bg-primary/10" : "bg-secondary/10"}`}>
                <Icon className={`w-4 h-4 ${isPositive ? "text-primary" : "text-secondary"}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm flex items-center ${isPositive ? "text-primary" : "text-secondary"}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {item.change}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.period}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}