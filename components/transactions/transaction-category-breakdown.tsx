"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from "@/hooks/use-transactions"
import { useEffect } from "react"

interface CategoryBreakdownProps {
  dateRange?: string
}

export function CategoryBreakdown({ dateRange }: CategoryBreakdownProps) {
  const { 
    categoryBreakdown, 
    loading, 
    loadCategoryBreakdown 
  } = useTransactions()

  useEffect(() => {
    loadCategoryBreakdown(dateRange)
  }, [dateRange, loadCategoryBreakdown])

  if (loading.breakdown.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Desglose por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading.breakdown.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Desglose por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500">
            Error: {loading.breakdown.error}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!categoryBreakdown || !Array.isArray(categoryBreakdown) || categoryBreakdown.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Desglose por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No hay datos para mostrar
          </p>
        </CardContent>
      </Card>
    )
  }

  const totalAmount = categoryBreakdown.reduce((sum, item) => {
    const amount = typeof item?.amount === 'number' ? item.amount : 0
    return sum + amount
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desglose por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryBreakdown.map((item, index) => {
            if (!item || !item.category) return null

            const amount = typeof item.amount === 'number' ? item.amount : 0
            const percentage = totalAmount > 0 ? (Math.abs(amount) / Math.abs(totalAmount)) * 100 : 0
            const isIncome = item.type === "income"
            const isExpense = item.type === "expense"

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className={`text-sm font-semibold ${
                    isIncome
                      ? "text-primary"
                      : isExpense
                      ? "text-destructive"
                      : "text-foreground"
                  }`}>
                    {isIncome ? "+" : isExpense ? "-" : ""}
                    €{Math.abs(amount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isIncome
                          ? "bg-primary"
                          : isExpense
                          ? "bg-destructive"
                          : "bg-primary"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            )
          })}
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>
                €{totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}