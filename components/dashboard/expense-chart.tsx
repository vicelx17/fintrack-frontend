"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboard } from "@/hooks/use-dashboard"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function ExpenseChart() {

  const { monthlyData, categoryData, loading } = useDashboard()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis Financiero</CardTitle>
        <CardDescription>Resumen de ingresos, gastos mensuales y por categorías</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="monthly">Mensual</TabsTrigger>
            <TabsTrigger value="categories">Por Categorías</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4">
            {loading.monthly.isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Cargando datos mensuales...</p>
              </div>
            ) : loading.monthly.error ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-red-500">Error: {loading.monthly.error}</p>
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No hay datos disponibles</p>
              </div>
            ) : (
              <ChartContainer
                config={{
                  incomes: {
                    label: "Ingresos",
                    color: "#2D5A3D",
                  },
                  expenses: {
                    label: "Gastos",
                    color: "#f17070ff",
                  },
                  balance: {
                    label: "Balance",
                    color: "#6B9B7A",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="incomes"
                      stackId="1"
                      stroke="#2D5A3D"
                      fill="#2D5A3D"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stackId="2"
                      stroke="#e68585ff"
                      fill="#e68585ff"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            {loading.category.isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Cargando categorías...</p>
              </div>
            ) : loading.category.error ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-red-500">Error: {loading.category.error}</p>
              </div>
            ) : categoryData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No hay datos de categorías</p>
              </div>
            ) : (
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
                  <BarChart data={categoryData} layout="horizontal">
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="amount" fill="#2D5A3D" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
