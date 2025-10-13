"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryAnalysis } from "@/services/reports-api"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface IncomeAnalysisProps {
  data: CategoryAnalysis[]
  isLoading?: boolean
}

export function IncomeAnalysis({ data, isLoading }: IncomeAnalysisProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Ingresos</CardTitle>
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
          <CardTitle>Análisis de Ingresos</CardTitle>
          <CardDescription>No hay datos de ingresos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Sin datos para mostrar
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalIncome = data.reduce((sum, item) => sum + item.amount, 0)
  const topCategories = data.slice(0, 4)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Ingresos</CardTitle>
        <CardDescription>Fuentes de ingresos</CardDescription>
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
              <BarChart data={data}>
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="#2D5A3D" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="grid grid-cols-2 gap-4">
            {topCategories.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm">{item.category}</span>
                </div>
                <div className="text-2xl font-bold">€{item.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}% del total</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}