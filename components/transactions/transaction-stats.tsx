import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ArrowUpDown, Calendar } from "lucide-react"

export function TransactionStats() {
  const stats = [
    {
      title: "Total Transacciones",
      value: "247",
      subtitle: "Este mes",
      icon: ArrowUpDown,
      color: "text-primary",
    },
    {
      title: "Total Ingresos",
      value: "€4,200.00",
      subtitle: "+8.2% vs mes anterior",
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Total Gastos",
      value: "€2,850.30",
      subtitle: "-3.1% vs mes anterior",
      icon: TrendingDown,
      color: "text-secondary",
    },
    {
      title: "Promedio Diario",
      value: "€43.55",
      subtitle: "Últimos 30 días",
      icon: Calendar,
      color: "text-muted-foreground",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
