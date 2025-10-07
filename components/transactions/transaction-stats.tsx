"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from "@/hooks/use-transactions"
import { ArrowUpDown, Calendar, TrendingDown, TrendingUp } from "lucide-react"
import { useEffect } from "react"

interface TransactionStatsProps {
  dateRange?: string
}

export function TransactionStats({ dateRange }: TransactionStatsProps) {
  const { 
    transactionStats, 
    loading, 
    loadTransactionStats 
  } = useTransactions()

  useEffect(() => {
    loadTransactionStats(dateRange)
  }, [dateRange, loadTransactionStats])

  if (loading.stats.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-28"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (loading.stats.error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Error cargando estadísticas: {loading.stats.error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Validación adicional para asegurar que todos los datos existen
  if (!transactionStats || 
      transactionStats.totalTransactions === undefined ||
      transactionStats.totalIncome === undefined ||
      transactionStats.totalExpenses === undefined ||
      transactionStats.averageDaily === undefined) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No hay estadísticas disponibles</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Transacciones",
      value: (transactionStats.totalTransactions ?? 0).toString(),
      subtitle: "Período seleccionado",
      icon: ArrowUpDown,
      color: "text-primary",
    },
    {
      title: "Total Ingresos",
      value: `€${(transactionStats.totalIncome ?? 0).toLocaleString('es-ES', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`,
      subtitle: "Período seleccionado",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Total Gastos",
      value: `€${(transactionStats.totalExpenses ?? 0).toLocaleString('es-ES', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`,
      subtitle: "Período seleccionado",
      icon: TrendingDown,
      color: "text-red-600",
    },
    {
      title: "Promedio Diario",
      value: `€${(transactionStats.averageDaily ?? 0).toLocaleString('es-ES', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`,
      subtitle: "Balance neto",
      icon: Calendar,
      color: (transactionStats.averageDaily ?? 0) >= 0 ? "text-green-600" : "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}