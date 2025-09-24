"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const monthlyTrends = [
  { month: "Jul", income: 4150, expenses: 2800, balance: 1350, savings: 1200 },
  { month: "Ago", income: 4300, expenses: 2950, balance: 1350, savings: 1300 },
  { month: "Sep", income: 4200, expenses: 2700, balance: 1500, savings: 1400 },
  { month: "Oct", income: 4200, expenses: 2850, balance: 1350, savings: 1350 },
  { month: "Nov", income: 5480, expenses: 3200, balance: 2280, savings: 1600 },
  { month: "Dic", income: 4800, expenses: 3000, balance: 1800, savings: 1700 },
]

const weeklyTrends = [
  { week: "S1", income: 1050, expenses: 750, balance: 300 },
  { week: "S2", income: 1200, expenses: 800, balance: 400 },
  { week: "S3", income: 1100, expenses: 700, balance: 400 },
  { week: "S4", income: 1450, expenses: 750, balance: 700 },
]

export function TrendAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Tendencias</CardTitle>
        <CardDescription>Evolución de ingresos, gastos y balance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="monthly">Mensual</TabsTrigger>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4">
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
                <LineChart data={monthlyTrends}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="income" stroke="#2D5A3D" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#4A7F5C" strokeWidth={2} />
                  <Line type="monotone" dataKey="balance" stroke="#6B9B7A" strokeWidth={2} />
                  <Line type="monotone" dataKey="savings" stroke="#8CB798" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
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
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrends}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="income" stroke="#2D5A3D" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#4A7F5C" strokeWidth={2} />
                  <Line type="monotone" dataKey="balance" stroke="#6B9B7A" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">+12.3%</div>
            <div className="text-xs text-muted-foreground">Crecimiento Ingresos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">-5.1%</div>
            <div className="text-xs text-muted-foreground">Reducción Gastos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">+28.7%</div>
            <div className="text-xs text-muted-foreground">Mejora Balance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">+15.4%</div>
            <div className="text-xs text-muted-foreground">Aumento Ahorros</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
