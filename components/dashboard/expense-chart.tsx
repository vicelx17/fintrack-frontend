"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCategoryData, useMonthlyData } from "@/hooks/use-dashboard"
import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function ExpenseChart() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [activeTab, setActiveTab] = useState<string>("monthly")
  
  const { data: monthlyData, isLoading: loadingMonthly, error: errorMonthly } = useMonthlyData(6)
  const { data: categoryData, isLoading: loadingCategory, error: errorCategory } = useCategoryData(selectedMonth, selectedYear)

  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis Financiero</CardTitle>
        <CardDescription>Resumen de ingresos, gastos mensuales y por categorías</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
            <TabsList>
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
              <TabsTrigger value="categories">Por Categorías</TabsTrigger>
            </TabsList>
            {activeTab === "categories" && (
              <div className="flex gap-6 items-end min-w-[250px]">
                <div className="flex flex-col min-w-[120px]">
                  <span className="text-xs text-muted-foreground mb-1">Mes</span>
                  <Select 
                    value={selectedMonth.toString()} 
                    onValueChange={(value) => setSelectedMonth(parseInt(value))}
                  >
                    <SelectTrigger className="w-full min-w-[120px]">
                      <SelectValue placeholder="Seleccionar mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col min-w-[100px]">
                  <span className="text-xs text-muted-foreground mb-1">Año</span>
                  <Select 
                    value={selectedYear.toString()} 
                    onValueChange={(value) => setSelectedYear(parseInt(value))}
                  >
                    <SelectTrigger className="w-full min-w-[100px]">
                      <SelectValue placeholder="Seleccionar año" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <TabsContent value="monthly" className="space-y-4">
            {loadingMonthly ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Cargando datos mensuales...</p>
              </div>
            ) : errorMonthly ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-red-500">Error: {errorMonthly}</p>
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
            {loadingCategory ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Cargando categorías...</p>
              </div>
            ) : errorCategory ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-red-500">Error: {errorCategory}</p>
              </div>
            ) : categoryData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No hay datos de categorías para este período</p>
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
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="incomes" fill="#2D5A3D" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="#e68585ff" radius={[4, 4, 0, 0]} />
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