"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendData } from "@/services/reports-api"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Skeleton } from "../ui/skeleton"

interface TrendAnalysisProps {
  data: TrendData[]
  period: string
  isLoading?: boolean
}

export function TrendAnalysis({ data, period, isLoading }: TrendAnalysisProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Tendencias</CardTitle>
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
          <CardTitle>Análisis de Tendencias</CardTitle>
          <CardDescription>No hay datos de tendencias disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Sin datos para mostrar
          </div>
        </CardContent>
      </Card>
    )
  }

  const firstPeriod = data[0]
  const lastPeriod = data[data.length - 1]
  
  const incomeGrowth = firstPeriod.income > 0 
    ? ((lastPeriod.income - firstPeriod.income) / firstPeriod.income * 100).toFixed(1)
    : "0.0"
    
  const expenseReduction = firstPeriod.expenses > 0
    ? ((firstPeriod.expenses - lastPeriod.expenses) / firstPeriod.expenses * 100).toFixed(1)
    : "0.0"
    
  const balanceImprovement = firstPeriod.balance !== 0
    ? ((lastPeriod.balance - firstPeriod.balance) / Math.abs(firstPeriod.balance) * 100).toFixed(1)
    : "0.0"
    
  const savingsIncrease = (firstPeriod.savings ?? 0) !== 0
    ? (((lastPeriod.savings ?? 0) - (firstPeriod.savings ?? 0)) / Math.abs(firstPeriod.savings ?? 0) * 100).toFixed(1)
    : "0.0"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Tendencias</CardTitle>
        <CardDescription>Evolución de ingresos, gastos y balance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ChartContainer
            config={{
              income: {
                label: "Ingresos",
                color: "#2D5A3D",
              },
              expenses: {
                label: "Gastos",
                color: "#4A7F5C",
              },
              balance: {
                label: "Balance",
                color: "#6B9B7A",
              },
              savings: {
                label: "Ahorros",
                color: "#8CB798",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="period" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="income" stroke="#2D5A3D" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#4A7F5C" strokeWidth={2} />
                <Line type="monotone" dataKey="balance" stroke="#6B9B7A" strokeWidth={2} />
                <Line type="monotone" dataKey="savings" stroke="#8CB798" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{incomeGrowth > "0" ? "+" : ""}{incomeGrowth}%</div>
              <div className="text-xs text-muted-foreground">Crecimiento Ingresos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{expenseReduction > "0" ? "-" : ""}{expenseReduction}%</div>
              <div className="text-xs text-muted-foreground">Reducción Gastos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{balanceImprovement > "0" ? "+" : ""}{balanceImprovement}%</div>
              <div className="text-xs text-muted-foreground">Mejora Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{savingsIncrease > "0" ? "+" : ""}{savingsIncrease}%</div>
              <div className="text-xs text-muted-foreground">Aumento Ahorros</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}