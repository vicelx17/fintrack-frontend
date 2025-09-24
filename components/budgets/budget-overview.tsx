import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, AlertTriangle } from "lucide-react"

export function BudgetOverview() {
  const overviewData = [
    {
      title: "Presupuesto Total",
      value: "€3,500.00",
      subtitle: "Este mes",
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Gastado",
      value: "€2,850.30",
      subtitle: "81.4% del presupuesto",
      icon: TrendingDown,
      color: "text-secondary",
    },
    {
      title: "Disponible",
      value: "€649.70",
      subtitle: "18.6% restante",
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Presupuestos Excedidos",
      value: "2",
      subtitle: "De 8 categorías",
      icon: AlertTriangle,
      color: "text-destructive",
    },
  ]

  const totalBudget = 3500
  const totalSpent = 2850.3
  const percentage = (totalSpent / totalBudget) * 100

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

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso General del Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Gastado</span>
              <span className="text-sm text-muted-foreground">
                €{totalSpent.toFixed(2)} / €{totalBudget.toFixed(2)}
              </span>
            </div>
            <Progress value={percentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{percentage.toFixed(1)}% usado</span>
              <span>€{(totalBudget - totalSpent).toFixed(2)} restante</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
