import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinancialSummary } from "@/hooks/use-dashboard"
import { CreditCard, EuroIcon, PiggyBank, TrendingDown, TrendingUp } from "lucide-react"

export function FinancialSummary() {
  const { data: financialSummary, isLoading, error } = useFinancialSummary()

  if (isLoading || !financialSummary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="relative overflow-hidden animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Error cargando datos financieros: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const summaryData = [
    {
      title: "Balance Total",
      value: `€${(financialSummary.total_balance || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      change: financialSummary.changes?.balance || "0.0%",
      trend: String(financialSummary.changes?.balance || "").startsWith('+') ? "up" : "down",
      icon: EuroIcon,
      description: "vs mes anterior",
    },
    {
      title: "Ingresos del Mes",
      value: `€${(financialSummary.monthly_income || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      change: financialSummary.changes?.income || "0.0%",
      trend: String(financialSummary.changes?.income || "").startsWith('+') ? "up" : "down",
      icon: TrendingUp,
      description: "vs mes anterior",
    },
    {
      title: "Gastos del Mes",
      value: `€${(financialSummary.monthly_expenses || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      change: financialSummary.changes?.expenses || "0.0%",
      trend: String(financialSummary.changes?.expenses || "").startsWith('-') ? "up" : "down",
      icon: CreditCard,
      description: "vs mes anterior",
    },
    {
      title: "Ahorros",
      value: `€${(financialSummary.saving || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      change: financialSummary.changes?.savings || "0.0%",
      trend: String(financialSummary.changes?.savings || "").startsWith('+') ? "up" : "down",
      icon: PiggyBank,
      description: "vs mes anterior"
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((item, index) => {
        const Icon = item.icon
        const isPositive = item.trend === "up"

        return (
          <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
              <div className={`p-2 rounded-lg ${isPositive ? "bg-primary/10" : "bg-secondary/10"}`}>
                <Icon className={`w-4 h-4 ${isPositive ? "text-primary" : "text-secondary"}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`flex items-center ${isPositive ? "text-primary" : "text-secondary"}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {item.change}
                  </span>
                  <span className="text-muted-foreground">{item.description}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}