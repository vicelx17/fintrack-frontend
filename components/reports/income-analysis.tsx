"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const incomeData = [
  { month: "Oct", salary: 4200, freelance: 800, investments: 150, other: 50 },
  { month: "Nov", salary: 4200, freelance: 1200, investments: 180, other: 100 },
  { month: "Dic", salary: 4200, freelance: 900, investments: 200, other: 300 },
]

export function IncomeAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Ingresos</CardTitle>
        <CardDescription>Fuentes de ingresos - Últimos 3 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ChartContainer
            config={{
              salary: {
                label: "Salario",
                color: "#2D5A3D",
              },
              freelance: {
                label: "Freelance",
                color: "#4A7F5C",
              },
              investments: {
                label: "Inversiones",
                color: "#6B9B7A",
              },
              other: {
                label: "Otros",
                color: "#8CB798",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="salary" stackId="a" fill="#2D5A3D" />
                <Bar dataKey="freelance" stackId="a" fill="#4A7F5C" />
                <Bar dataKey="investments" stackId="a" fill="#6B9B7A" />
                <Bar dataKey="other" stackId="a" fill="#8CB798" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#2D5A3D]" />
                <span className="text-sm">Salario</span>
              </div>
              <div className="text-2xl font-bold">€12,600</div>
              <div className="text-xs text-muted-foreground">75.0% del total</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#4A7F5C]" />
                <span className="text-sm">Freelance</span>
              </div>
              <div className="text-2xl font-bold">€2,900</div>
              <div className="text-xs text-muted-foreground">17.3% del total</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#6B9B7A]" />
                <span className="text-sm">Inversiones</span>
              </div>
              <div className="text-2xl font-bold">€530</div>
              <div className="text-xs text-muted-foreground">3.2% del total</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#8CB798]" />
                <span className="text-sm">Otros</span>
              </div>
              <div className="text-2xl font-bold">€450</div>
              <div className="text-xs text-muted-foreground">2.7% del total</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
