"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBalanceForecast } from "@/hooks/use-ai"
import { useMonthlyData } from "@/hooks/use-dashboard"
import { useState } from "react"

export function FinancialForecast() {
  const [timeframe, setTimeframe] = useState<"3months" | "6months" | "1year">("6months")
  const { forecast, isLoading: forecastLoading } = useBalanceForecast(timeframe)
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyData(6)

  const isLoading = forecastLoading || monthlyLoading

  // Build chart combining real historical data + forecast scenarios
  const historicalChart = monthlyData.map((m) => ({
    month: m.month,
    balance: m.balance,
    forecast: null as number | null,
  }))

  // Add forecast points if available
  const forecastPoints: { month: string; balance: null; forecast: number }[] = []
  if (forecast) {
    const monthsMap = { "3months": 3, "6months": 6, "1year": 12 }
    const monthCount = monthsMap[timeframe]
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const now = new Date()

    for (let i = 1; i <= monthCount; i++) {
      const futureMonth = new Date(now.getFullYear(), now.getMonth() + i, 1)
      forecastPoints.push({
        month: monthNames[futureMonth.getMonth()],
        balance: null,
        forecast: Math.round(forecast.scenarios.realistic.balance / monthCount * i),
      })
    }
  }

  const chartData = [...historicalChart, ...forecastPoints]

  const scenarios = forecast
    ? [
        {
          name: "Optimista",
          description: "Mantienes buenos hábitos y aumentas ingresos",
          endBalance: forecast.scenarios.optimistic.balance,
          probability: Math.round(forecast.scenarios.optimistic.probability * 100),
          color: "#2D5A3D",
        },
        {
          name: "Realista",
          description: "Continúas con tus patrones actuales",
          endBalance: forecast.scenarios.realistic.balance,
          probability: Math.round(forecast.scenarios.realistic.probability * 100),
          color: "#4A7F5C",
        },
        {
          name: "Conservador",
          description: "Gastos inesperados o reducción de ingresos",
          endBalance: forecast.scenarios.conservative.balance,
          probability: Math.round(forecast.scenarios.conservative.probability * 100),
          color: "#6B9B7A",
        },
      ]
    : []

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pronóstico Financiero</CardTitle>
          <CardDescription>Cargando datos reales...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center animate-pulse text-muted-foreground">
            Calculando escenarios...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pronóstico Financiero</CardTitle>
          <CardDescription>Proyección basada en tu historial real</CardDescription>
        </div>
        <Select value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">3 meses</SelectItem>
            <SelectItem value="6months">6 meses</SelectItem>
            <SelectItem value="1year">1 año</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forecast" className="space-y-4">
          <TabsList>
            <TabsTrigger value="forecast">Pronóstico</TabsTrigger>
            <TabsTrigger value="scenarios">Escenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-4">
            {monthlyData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No hay datos históricos disponibles
              </div>
            ) : (
              <ChartContainer
                config={{
                  balance: { label: "Balance Real", color: "#2D5A3D" },
                  forecast: { label: "Pronóstico", color: "#4A7F5C" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#2D5A3D"
                      fill="#2D5A3D"
                      fillOpacity={0.8}
                      connectNulls={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="forecast"
                      stroke="#4A7F5C"
                      fill="#4A7F5C"
                      fillOpacity={0.4}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}

            {forecast ? (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    €{forecast.scenarios.realistic.balance.toLocaleString("es-ES", { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-muted-foreground">Balance proyectado</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">
                    {Math.round(forecast.confidence * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Confianza</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {forecast.keyFactors.length} factores
                  </div>
                  <div className="text-xs text-muted-foreground">Analizados</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm">
                Necesitas más historial de transacciones para generar un pronóstico
              </div>
            )}

            {forecast?.keyFactors && forecast.keyFactors.length > 0 && (
              <div className="space-y-1 mt-2">
                <p className="text-xs font-medium text-muted-foreground">Factores clave:</p>
                {forecast.keyFactors.map((factor, i) => (
                  <p key={i} className="text-xs text-muted-foreground">• {factor}</p>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            {scenarios.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay suficientes datos para calcular escenarios
              </div>
            ) : (
              <div className="space-y-4">
                {scenarios.map((scenario, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: scenario.color }} />
                        <div>
                          <h3 className="font-medium">{scenario.name}</h3>
                          <p className="text-sm text-muted-foreground">{scenario.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{scenario.probability}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Balance final proyectado:</span>
                      <span className={`text-lg font-bold ${scenario.endBalance >= 0 ? "text-primary" : "text-destructive"}`}>
                        €{scenario.endBalance.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}