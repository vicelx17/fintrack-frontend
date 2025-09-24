import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Target, PiggyBank, CreditCard } from "lucide-react"

export function FinancialOverview() {
  const overviewData = [
    {
      title: "Ingresos Totales",
      value: "€12,600.00",
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp,
      period: "Últimos 3 meses",
    },
    {
      title: "Gastos Totales",
      value: "€8,550.90",
      change: "-3.1%",
      trend: "down",
      icon: TrendingDown,
      period: "Últimos 3 meses",
    },
    {
      title: "Balance Neto",
      value: "€4,049.10",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      period: "Últimos 3 meses",
    },
    {
      title: "Tasa de Ahorro",
      value: "32.1%",
      change: "+2.8%",
      trend: "up",
      icon: PiggyBank,
      period: "Promedio mensual",
    },
    {
      title: "Gasto Promedio Diario",
      value: "€95.01",
      change: "-1.2%",
      trend: "down",
      icon: CreditCard,
      period: "Últimos 90 días",
    },
    {
      title: "Cumplimiento Presupuesto",
      value: "87.5%",
      change: "+5.1%",
      trend: "up",
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
