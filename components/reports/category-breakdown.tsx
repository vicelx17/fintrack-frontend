import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CategoryAnalysis } from "@/services/reports-api"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Skeleton } from "../ui/skeleton"

interface CategoryBreakdownProps {
  data: CategoryAnalysis[]
  isLoading?: boolean
}

export function CategoryBreakdown({ data, isLoading }: CategoryBreakdownProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Desglose por Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Desglose por Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No hay datos disponibles
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desglose por Categorías</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.slice(0, 6).map((item, index) => {
            const budgetPercentage = item.budgetAmount
              ? (item.amount / item.budgetAmount) * 100
              : 0
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

                {item.budgetAmount && (
                  <>
                    <Progress value={Math.min(budgetPercentage, 100)} className="h-2" />

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>€{item.amount.toFixed(2)} gastado</span>
                      <span>€{item.budgetAmount.toFixed(2)} presupuesto</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {item.previousAmount && `Mes anterior: €${item.previousAmount.toFixed(2)}`}
                      </span>
                      <span className={budgetPercentage > 100 ? "text-destructive" : "text-muted-foreground"}>
                        {budgetPercentage.toFixed(1)}% usado
                      </span>
                    </div>
                  </>
                )}

                {!item.budgetAmount && (
                  <div className="text-xs text-muted-foreground">
                    Sin presupuesto asignado
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}