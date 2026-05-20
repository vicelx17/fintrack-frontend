"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSpendingPredictions } from "@/hooks/use-ai"
import { useMonthlyData } from "@/hooks/use-dashboard"
import { useState } from "react"

export function SpendingPredictions() {
  const [timeframe, setTimeframe] = useState("1month")
  const { predictions, isLoading: predictionsLoading } = useSpendingPredictions(timeframe)
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyData(6)

  const isLoading = predictionsLoading || monthlyLoading

  // Build chart data from real monthly data + predictions overlay
  const chartData = monthlyData.map((m, i) => ({
    month: m.month,
    actual: m.expenses,
    predicted: null as number | null,
  }))
 
  // Add a prediction point for next period if we have predictions
  if (predictions.length > 0) {
    const avgPredicted = predictions.reduce((sum, p) => sum + p.predicted, 0) / predictions.length
    chartData.push({
      month: "Próx.",
      actual: null as any,
      predicted: Math.round(avgPredicted * 100) / 100,
    })
  }
 
  const lastActual = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].expenses : 0
  const avgPredicted = predictions.length > 0
    ? predictions.reduce((sum, p) => sum + p.predicted, 0) / predictions.length
    : 0
  const avgConfidence = predictions.length > 0
    ? Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length * 100)
    : 0
  const changePercent = lastActual > 0
    ? (((avgPredicted - lastActual) / lastActual) * 100).toFixed(1)
    : "0.0"
 
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Predicciones de Gasto</CardTitle>
          <CardDescription>Cargando datos reales...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Analizando patrones...</div>
          </div>
        </CardContent>
      </Card>
    )
  }
 
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predicciones de Gasto</CardTitle>
        <CardDescription>Análisis predictivo basado en tus patrones históricos reales</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
              <TabsTrigger value="categories">Por Categorías</TabsTrigger>
            </TabsList>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 mes</SelectItem>
                <SelectItem value="3months">3 meses</SelectItem>
                <SelectItem value="6months">6 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
 
          <TabsContent value="monthly" className="space-y-4">
            {monthlyData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No hay datos históricos disponibles
              </div>
            ) : (
              <ChartContainer
                config={{
                  actual: { label: "Real", color: "#2D5A3D" },
                  predicted: { label: "Predicción", color: "#4A7F5C" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {predictions.length > 0 && (
                      <ReferenceLine x="Próx." stroke="#8CB798" strokeDasharray="2 2" />
                    )}
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#2D5A3D"
                      strokeWidth={3}
                      dot={{ fill: "#2D5A3D", strokeWidth: 2, r: 4 }}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#4A7F5C"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#4A7F5C", strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
 
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {avgPredicted > 0 ? `€${avgPredicted.toFixed(2)}` : "—"}
                </div>
                <div className="text-xs text-muted-foreground">Predicción próximo mes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {avgConfidence > 0 ? `${avgConfidence}%` : "—"}
                </div>
                <div className="text-xs text-muted-foreground">Confianza</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${parseFloat(changePercent) > 0 ? "text-destructive" : "text-primary"}`}>
                  {avgPredicted > 0 ? `${parseFloat(changePercent) > 0 ? "+" : ""}${changePercent}%` : "—"}
                </div>
                <div className="text-xs text-muted-foreground">vs mes actual</div>
              </div>
            </div>
          </TabsContent>
 
          <TabsContent value="categories" className="space-y-4">
            {predictions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay suficientes datos para predicciones por categoría</p>
                <p className="text-sm mt-1">Registra más transacciones para obtener predicciones</p>
              </div>
            ) : (
              <div className="space-y-4">
                {predictions.map((item, index) => {
                  const diff = item.predicted - item.current
                  const trendUp = diff > 0
                  return (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                      <div className="space-y-1">
                        <div className="font-medium">{item.factors[0]?.replace("Categoría: ", "") ?? `Categoría ${index + 1}`}</div>
                        <div className="text-sm text-muted-foreground">
                          Actual: €{item.current.toFixed(2)} → Predicción: €{item.predicted.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={trendUp ? "destructive" : "secondary"} className="text-xs">
                          {trendUp ? "↑" : "↓"} €{Math.abs(diff).toFixed(2)}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-medium">{Math.round(item.confidence * 100)}%</div>
                          <div className="text-xs text-muted-foreground">confianza</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}