import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

const categoryData = [
  {
    category: "Alimentación",
    current: 850,
    previous: 920,
    budget: 1000,
    trend: "down",
    change: -7.6,
  },
  {
    category: "Transporte",
    current: 420,
    previous: 380,
    budget: 500,
    trend: "up",
    change: 10.5,
  },
  {
    category: "Entretenimiento",
    current: 320,
    previous: 280,
    budget: 300,
    trend: "up",
    change: 14.3,
  },
  {
    category: "Servicios",
    current: 680,
    previous: 700,
    budget: 700,
    trend: "down",
    change: -2.9,
  },
  {
    category: "Compras",
    current: 280,
    previous: 350,
    budget: 400,
    trend: "down",
    change: -20.0,
  },
  {
    category: "Salud",
    current: 80,
    previous: 120,
    budget: 200,
    trend: "down",
    change: -33.3,
  },
]

export function CategoryBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desglose por Categorías</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categoryData.map((item, index) => {
            const budgetPercentage = (item.current / item.budget) * 100
            const isOverBudget = budgetPercentage > 100
            const isNearLimit = budgetPercentage > 80 && budgetPercentage <= 100

            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.category}</span>
                    {isOverBudget && (
                      <Badge variant="destructive" className="text-xs">
                        Excedido
                      </Badge>
                    )}
                    {isNearLimit && (
                      <Badge variant="secondary" className="text-xs">
                        Cerca del límite
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm flex items-center ${item.trend === "up" ? "text-destructive" : "text-primary"}`}
                    >
                      {item.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(item.change)}%
                    </span>
                  </div>
                </div>

                <Progress value={Math.min(budgetPercentage, 100)} className="h-2" />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>€{item.current} gastado</span>
                  <span>€{item.budget} presupuesto</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Mes anterior: €{item.previous}</span>
                  <span className={budgetPercentage > 100 ? "text-destructive" : "text-muted-foreground"}>
                    {budgetPercentage.toFixed(1)}% usado
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
