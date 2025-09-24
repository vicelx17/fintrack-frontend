"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const monthlyData = [
  { month: "Ene", ingresos: 4200, gastos: 2800, balance: 1400 },
  { month: "Feb", ingresos: 3800, gastos: 3200, balance: 600 },
  { month: "Mar", ingresos: 4500, gastos: 2900, balance: 1600 },
  { month: "Abr", ingresos: 4100, gastos: 3100, balance: 1000 },
  { month: "May", ingresos: 4300, gastos: 2700, balance: 1600 },
  { month: "Jun", ingresos: 4200, gastos: 2850, balance: 1350 },
]

const categoryData = [
  { category: "Alimentación", amount: 850, color: "#2D5A3D" },
  { category: "Transporte", amount: 420, color: "#4A7F5C" },
  { category: "Entretenimiento", amount: 320, color: "#6B9B7A" },
  { category: "Servicios", amount: 680, color: "#8CB798" },
  { category: "Compras", amount: 280, color: "#AED3B6" },
  { category: "Otros", amount: 300, color: "#D0EFD4" },
]

export function ExpenseChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis Financiero</CardTitle>
        <CardDescription>Resumen de ingresos, gastos y balance mensual</CardDescription>
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
                ingresos: {
                  label: "Ingresos",
                  color: "#2D5A3D",
                },
                gastos: {
                  label: "Gastos",
                  color: "#4A7F5C",
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
                    dataKey="ingresos"
                    stackId="1"
                    stroke="#2D5A3D"
                    fill="#2D5A3D"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="gastos"
                    stackId="2"
                    stroke="#4A7F5C"
                    fill="#4A7F5C"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
