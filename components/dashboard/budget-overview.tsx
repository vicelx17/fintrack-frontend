import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useBudgetOverview } from "@/hooks/use-dashboard"
import { AlertTriangle, CheckCircle } from "lucide-react"

export function BudgetOverview() {
  const { data: budgetOverview, isLoading, error } = useBudgetOverview()

  // Helper functions for icon and badge
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="w-4 h-4 text-primary" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "over":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge className="bg-primary/10 text-primary border-primary/20">En Control</Badge>
      case "warning":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-orange-500" />
            Cerca del Límite
          </Badge>
        )
      case "over":
        return <Badge variant="destructive">Excedido</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Presupuestos</CardTitle>
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
                const isGood = budget.status === "good"

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(budget.status)}
                        <span className="font-medium text-sm">{budget.category}</span>
                        {getStatusBadge(budget.status)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        €{budget.spent.toFixed(2)} / €{budget.budget.toFixed(2)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(budget.percentage, 100)}
                      className={
                        `h-2 ${
                          isGood
                            ? "bg-primary/20 [&>div]:bg-primary"
                            : isWarning
                            ? "bg-orange-100 [&>div]:bg-orange-400"
                            : isOver
                            ? "bg-destructive/20 [&>div]:bg-destructive"
                            : ""
                        }`
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{budget.percentage.toFixed(1)}% usado</span>
                      <span className={isOver ? "text-destructive" : ""}>
                        €{isOver? budget.spent - budget.budget : budget.remaining.toFixed(2)} {isOver ? "excedido" : "restante"}
                      </span>
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