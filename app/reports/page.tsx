"use client"

import { CategoryBreakdown } from "@/components/reports/category-breakdown"
import { ExpenseAnalysis } from "@/components/reports/expense-analysis"
import { FinancialOverview } from "@/components/reports/financial-overview"
import { IncomeAnalysis } from "@/components/reports/income-analysis"
import { ReportFilters } from "@/components/reports/report-filters"
import { ReportsHeader } from "@/components/reports/reports-header"
import { TrendAnalysis } from "@/components/reports/trend-analysis"
import { useReports } from "@/hooks/use-reports"
import { useToast } from "@/hooks/use-toast"
import { ReportFilters as ReportFiltersType } from "@/services/reports-api"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function ReportsPage() {
  const { toast } = useToast()
  const {
    financialSummary,
    expenseAnalysis,
    incomeAnalysis,
    trendData,
    loading,
    loadAllReportData,
    exportReport,
  } = useReports()

  const [currentPeriod, setCurrentPeriod] = useState("month")
  const [filters, setFilters] = useState<ReportFiltersType>({
    dateRange: "month",
    reportType: "comprehensive",
  })
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Carga inicial
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await loadAllReportData(currentPeriod)
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del reporte",
          variant: "destructive",
        })
      } finally {
        setIsInitialLoad(false)
      }
    }

    loadInitialData()
  }, [])

  const handleFiltersApply = async (newFilters: ReportFiltersType) => {
    setFilters(newFilters)
    setCurrentPeriod(newFilters.dateRange)
    
    try {
      await loadAllReportData(newFilters.dateRange)
      toast({
        title: "Filtros aplicados",
        description: "Los datos se han actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron aplicar los filtros",
        variant: "destructive",
      })
    }
  }

  const handleExport = async (format: "pdf" | "csv" | "json") => {
    const success = await exportReport(filters, format)
    if (success) {
      toast({
        title: "Reporte exportado",
        description: `El reporte se ha descargado en formato ${format.toUpperCase()}`,
      })
    } else {
      toast({
        title: "Error",
        description: "No se pudo exportar el reporte",
        variant: "destructive",
      })
    }
  }

  // Mostrar loader solo en carga inicial
  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  const isRefreshing = loading.summary.isLoading || loading.expenses.isLoading || loading.income.isLoading

  return (
    <div className="min-h-screen bg-background">
      <ReportsHeader onExport={handleExport} isExporting={loading.export.isLoading} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Report Filters */}
        <ReportFilters onFiltersApply={handleFiltersApply} currentFilters={filters} />

        {/* Loading indicator durante refresh */}
        {isRefreshing && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-sm text-muted-foreground">Actualizando datos...</span>
          </div>
        )}

        {/* Financial Overview */}
        <FinancialOverview summary={financialSummary} isLoading={loading.summary.isLoading} />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Expense Analysis */}
          <ExpenseAnalysis data={expenseAnalysis} isLoading={loading.expenses.isLoading} />

          {/* Income Analysis */}
          <IncomeAnalysis data={incomeAnalysis} isLoading={loading.income.isLoading} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trend Analysis */}
          <div className="lg:col-span-2">
            <TrendAnalysis data={trendData} period={currentPeriod} isLoading={loading.trends.isLoading} />
          </div>

          {/* Category Breakdown */}
          <CategoryBreakdown data={expenseAnalysis} isLoading={loading.expenses.isLoading} />
        </div>
      </main>
    </div>
  )
}