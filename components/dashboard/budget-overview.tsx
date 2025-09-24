import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const budgets = [
  {
    category: "Alimentación",
    spent: 850,
    budget: 1000,
    color: "bg-primary",
    status: "good",
  },
  {
    category: "Transporte",
    spent: 420,
    budget: 500,
    color: "bg-secondary",
    status: "good",
  },
  {
    category: "Entretenimiento",
    spent: 320,
    budget: 300,
    color: "bg-destructive",
    status: "over",
  },
  {
    category: "Servicios",
    spent: 680,
    budget: 700,
    color: "bg-chart-3",
    status: "warning",
  },
]

export function BudgetOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presupuestos del Mes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget, index) => {
            const percentage = (budget.spent / budget.budget) * 100
            const isOver = percentage > 100
            const isWarning = percentage > 80 && percentage <= 100

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{budget.category}</span>
                    {isOver && (
                      <Badge variant="destructive" className="text-xs">
                        Excedido
                      </Badge>
                    )}
                    {isWarning && (
                      <Badge variant="secondary" className="text-xs">
                        Cerca del límite
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    €{budget.spent} / €{budget.budget}
                  </span>
                </div>
                <Progress value={Math.min(percentage, 100)} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{percentage.toFixed(1)}% usado</span>
                  <span>€{budget.budget - budget.spent} restante</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
