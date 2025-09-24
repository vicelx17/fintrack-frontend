"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const forecastData = [
  { month: "Oct", balance: 12450, forecast: null, confidence: null },
  { month: "Nov", balance: 13800, forecast: null, confidence: null },
  { month: "Dic", balance: 15600, forecast: null, confidence: null },
  { month: "Ene", balance: null, forecast: 16800, confidence: 85 },
  { month: "Feb", balance: null, forecast: 18200, confidence: 82 },
  { month: "Mar", balance: null, forecast: 19400, confidence: 78 },
  { month: "Abr", balance: null, forecast: 20800, confidence: 75 },
  { month: "May", balance: null, forecast: 22100, confidence: 72 },
  { month: "Jun", balance: null, forecast: 23500, confidence: 68 },
]

const scenarios = [
  {
    name: "Optimista",
    description: "Mantienes hábitos actuales y recibes bonificación",
    endBalance: 25200,
    probability: 25,
    color: "#2D5A3D",
  },
  {
    name: "Realista",
    description: "Continúas con patrones de gasto actuales",
    endBalance: 23500,
    probability: 50,
    color: "#4A7F5C",
  },
  {
    name: "Conservador",
    description: "Gastos inesperados y reducción de ingresos",
    endBalance: 21800,
    probability: 25,
    color: "#6B9B7A",
  },
]

export function FinancialForecast() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pronóstico Financiero</CardTitle>
        <CardDescription>Proyección de balance basada en IA - Próximos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forecast" className="space-y-4">
          <TabsList>
            <TabsTrigger value="forecast">Pronóstico</TabsTrigger>
            <TabsTrigger value="scenarios">Escenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-4">
            <ChartContainer
              config={{
                balance: {
                  label: "Balance Real",
                  color: "#2D5A3D",
                },
                forecast: {
                  label: "Pronóstico",
                  color: "#4A7F5C",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
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

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">€23,500</div>
                <div className="text-xs text-muted-foreground">Balance Proyectado (Jun)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">68%</div>
                <div className="text-xs text-muted-foreground">Confianza Promedio</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">+50.6%</div>
                <div className="text-xs text-muted-foreground">Crecimiento Proyectado</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
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
                    <span className="text-lg font-bold">€{scenario.endBalance.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
