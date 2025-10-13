"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryAnalysis } from "@/services/reports-api"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"

interface ExpenseAnalysisProps {
  data: CategoryAnalysis[]
  isLoading?: boolean
}

const COLORS = ["#2D5A3D", "#4A7F5C", "#6B9B7A", "#8CB798", "#AED3B6", "#D0EFD4"]

export function ExpenseAnalysis({ data, isLoading }: ExpenseAnalysisProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Gastos</CardTitle>
          <CardDescription>Cargando datos...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Gastos</CardTitle>
          <CardDescription>No hay datos de gastos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Sin datos para mostrar
          </div>
        </CardContent>
      </Card>
    )
  }

  const expenseData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }))

  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Gastos</CardTitle>
        <CardDescription>Distribución por categorías</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ChartContainer
            config={{
              amount: {
                label: "Cantidad",
                color: "#2D5A3D",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Total de Gastos</span>
              <span>€{totalExpenses.toLocaleString("es-ES", { minimumFractionDigits: 2 })}</span>
            </div>
            {expenseData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">{item.percentage.toFixed(1)}%</span>
                  <span className="font-medium">€{item.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}