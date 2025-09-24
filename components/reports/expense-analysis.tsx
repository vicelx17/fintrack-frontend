"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const expenseData = [
  { category: "Alimentación", amount: 2550, color: "#2D5A3D", percentage: 29.8 },
  { category: "Vivienda", amount: 2400, color: "#4A7F5C", percentage: 28.1 },
  { category: "Transporte", amount: 1260, color: "#6B9B7A", percentage: 14.7 },
  { category: "Entretenimiento", amount: 960, color: "#8CB798", percentage: 11.2 },
  { category: "Servicios", amount: 840, color: "#AED3B6", percentage: 9.8 },
  { category: "Otros", amount: 540, color: "#D0EFD4", percentage: 6.3 },
]

export function ExpenseAnalysis() {
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Gastos</CardTitle>
        <CardDescription>Distribución por categorías - Últimos 3 meses</CardDescription>
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
              <span>€{totalExpenses.toLocaleString()}</span>
            </div>
            {expenseData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">{item.percentage}%</span>
                  <span className="font-medium">€{item.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
