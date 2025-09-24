"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const monthlyPredictions = [
  { month: "Oct", actual: 2800, predicted: 2850, confidence: 95 },
  { month: "Nov", actual: 3200, predicted: 3150, confidence: 92 },
  { month: "Dic", actual: 3000, predicted: 3100, confidence: 88 },
  { month: "Ene", actual: null, predicted: 2950, confidence: 85 },
  { month: "Feb", actual: null, predicted: 3050, confidence: 82 },
  { month: "Mar", actual: null, predicted: 2900, confidence: 78 },
]

const categoryPredictions = [
  { category: "Alimentación", current: 850, predicted: 920, trend: "up", confidence: 90 },
  { category: "Transporte", current: 420, predicted: 380, trend: "down", confidence: 85 },
  { category: "Entretenimiento", current: 320, predicted: 350, trend: "up", confidence: 75 },
  { category: "Servicios", current: 680, predicted: 700, trend: "up", confidence: 95 },
  { category: "Compras", current: 280, predicted: 320, trend: "up", confidence: 70 },
]

export function SpendingPredictions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predicciones de Gasto</CardTitle>
        <CardDescription>Análisis predictivo basado en patrones históricos y tendencias</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="monthly">Mensual</TabsTrigger>
            <TabsTrigger value="categories">Por Categorías</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4">
            <ChartContainer
              config={{
                actual: {
                  label: "Real",
                  color: "#2D5A3D",
                },
                predicted: {
                  label: "Predicción",
                  color: "#4A7F5C",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyPredictions}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ReferenceLine x="Dic" stroke="#8CB798" strokeDasharray="2 2" />
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

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">€2,950</div>
                <div className="text-xs text-muted-foreground">Predicción Enero</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">85%</div>
                <div className="text-xs text-muted-foreground">Confianza</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">+3.5%</div>
                <div className="text-xs text-muted-foreground">vs Diciembre</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="space-y-4">
              {categoryPredictions.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                  <div className="space-y-1">
                    <div className="font-medium">{item.category}</div>
                    <div className="text-sm text-muted-foreground">
                      Actual: €{item.current} → Predicción: €{item.predicted}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={item.trend === "up" ? "destructive" : "secondary"} className="text-xs">
                      {item.trend === "up" ? "↑" : "↓"} €{Math.abs(item.predicted - item.current)}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium">{item.confidence}%</div>
                      <div className="text-xs text-muted-foreground">confianza</div>
                    </div>
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
