import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useBudgetOverview } from "@/hooks/use-dashboard"

export function BudgetOverview() {
  const { data: budgetOverview, isLoading, error } = useBudgetOverview()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Presupuestos del Mes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4">
            {budgetOverview.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay presupuestos configurados</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Crea un presupuesto para comenzar a hacer seguimiento
                </p>
              </div>
            ) : (
              budgetOverview.map((budget, index) => {
                const isOver = budget.status === "over"
                const isWarning = budget.status === "warning"

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
                        €{budget.spent.toFixed(2)} / €{budget.budget.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={Math.min(budget.percentage, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{budget.percentage.toFixed(1)}% usado</span>
                      <span>€{budget.remaining.toFixed(2)} restante</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}