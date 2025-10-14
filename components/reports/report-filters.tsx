"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReportFilters as ReportFiltersType } from "@/services/reports-api"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Filter, RotateCcw } from "lucide-react"
import { useState } from "react"

interface ReportFiltersProps {
  onFiltersApply: (filters: ReportFiltersType) => void
  currentFilters: ReportFiltersType
}

export function ReportFilters({ onFiltersApply, currentFilters }: ReportFiltersProps) {
  const [dateRange, setDateRange] = useState(currentFilters.dateRange)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [reportType, setReportType] = useState<"comprehensive" | "expenses" | "income" | "budgets" | "trends">(currentFilters.reportType)
  const [categories, setCategories] = useState<string[]>(currentFilters.categories || [])
  const [transactionLimit, setTransactionLimit] = useState<number | undefined>(currentFilters.transactionLimit)

  const resetFilters = () => {
    setDateRange("month")
    setStartDate(undefined)
    setEndDate(undefined)
    setReportType("comprehensive")
    setCategories([])
    setTransactionLimit(undefined)

    onFiltersApply({
      dateRange: "month",
      reportType: "comprehensive",
      categories: []
    })
  }

  const applyFilters = () => {
    const filters: ReportFiltersType = {
      dateRange,
      reportType,
      categories: categories.length > 0 ? categories : undefined,
      transactionLimit,
    }

    if (dateRange === "custom" && startDate && endDate) {
      filters.startDate = format(startDate, "yyyy-MM-dd")
      filters.endDate = format(endDate, "yyyy-MM-dd")
    }

    onFiltersApply(filters)
  }


  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <Label>Período</Label>
            <Select value={dateRange} onValueChange={(value) => setDateRange(value as "week" | "month" | "quarter" | "year" | "custom")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="quarter">Este trimestre</SelectItem>
                <SelectItem value="year">Este año</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateRange === "custom" && (
            <>
              <div className="space-y-2">
                <Label>Fecha Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: es }) : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fecha Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: es }) : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Tipo de Reporte</Label>
            <Select
              value={reportType}
              onValueChange={(value: "comprehensive" | "expenses" | "income" | "budgets" | "trends") => setReportType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">Completo</SelectItem>
                <SelectItem value="expenses">Solo Gastos</SelectItem>
                <SelectItem value="income">Solo Ingresos</SelectItem>
                <SelectItem value="budgets">Presupuestos</SelectItem>
                <SelectItem value="trends">Tendencias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Límite de Transacciones</Label>
            <Select
              value={transactionLimit?.toString() || "all"}
              onValueChange={(value) => setTransactionLimit(value === "all" ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button className="flex-1" onClick={applyFilters}>
              <Filter className="w-4 h-4 mr-2" />
              Aplicar
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}