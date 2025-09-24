"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

export function AdminStats() {
  const stats = [
    {
      title: "Usuarios Totales",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Transacciones Hoy",
      value: "1,234",
      change: "+8%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Usuarios Activos",
      value: "892",
      change: "+15%",
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Alertas Pendientes",
      value: "23",
      change: "-5%",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</span>{" "}
              desde el mes pasado
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
