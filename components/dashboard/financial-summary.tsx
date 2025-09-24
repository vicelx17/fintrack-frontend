import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank } from "lucide-react"

export function FinancialSummary() {
  const summaryData = [
    {
      title: "Balance Total",
      value: "€12,450.80",
      change: "+2.5%",
      trend: "up",
      icon: DollarSign,
      description: "vs mes anterior",
    },
    {
      title: "Ingresos del Mes",
      value: "€4,200.00",
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp,
      description: "vs mes anterior",
    },
    {
      title: "Gastos del Mes",
      value: "€2,850.30",
      change: "-3.1%",
      trend: "down",
      icon: CreditCard,
      description: "vs mes anterior",
    },
    {
      title: "Ahorros",
      value: "€8,750.50",
      change: "+12.4%",
      trend: "up",
      icon: PiggyBank,
      description: "objetivo: €10,000",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((item, index) => {
        const Icon = item.icon
        const isPositive = item.trend === "up"

        return (
          <Card key={index} className="relative overflow-hidden">
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
