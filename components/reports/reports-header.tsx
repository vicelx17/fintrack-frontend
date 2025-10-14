"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Download, FileText, Share } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface ReportsHeaderProps {
  onExport: (format: "pdf" | "json", filters: ExportFilters) => Promise<void>
  isExporting: boolean
}

interface ExportFilters {
  dateRange: "week" | "month" | "quarter" | "year" | "custom"
  startDate?: string
  endDate?: string
  reportType: "comprehensive" | "expenses" | "income" | "budgets" | "trends"
  transactionLimit?: number
}

export function ReportsHeader({ onExport, isExporting }: ReportsHeaderProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<"pdf" | "json">("pdf")
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year" | "custom">("month")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [reportType, setReportType] = useState<"comprehensive" | "expenses" | "income" | "budgets" | "trends">("comprehensive")
  const [transactionLimit, setTransactionLimit] = useState<number | undefined>(undefined)

  const handleExport = async () => {
    const filters: ExportFilters = {
      dateRange,
      reportType,
      transactionLimit,
    }

    if (dateRange === "custom" && startDate && endDate) {
      filters.startDate = format(startDate, "yyyy-MM-dd")
      filters.endDate = format(endDate, "yyyy-MM-dd")
    }

    await onExport(exportFormat, filters)
    setOpen(false)
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reportes y Análisis</h1>
            <p className="text-muted-foreground mt-1">Insights detallados sobre tu situación financiera</p>
          </div>

          {/* Central navigation panel */}
          <nav className="flex-1 flex justify-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/transactions")}
              >
                Transacciones
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/budgets")}
              >
                Presupuestos
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/ai")}
              >
                IA Financiera
              </Button>
            </div>
          </nav>

          <div className="flex items-center space-x-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button disabled={isExporting}>
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? "Exportando..." : "Exportar"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Exportar Reporte</DialogTitle>
                  <DialogDescription>
                    Configura los parámetros de tu reporte antes de exportar
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Formato</Label>
                    <Select value={exportFormat} onValueChange={(value: "pdf" | "json") => setExportFormat(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            PDF
                          </div>
                        </SelectItem>
                        <SelectItem value="json">
                          <div className="flex items-center">
                            <Share className="mr-2 h-4 w-4" />
                            JSON
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Período</Label>
                    <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fecha Inicio</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP", { locale: es }) : "Seleccionar"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Tipo de Reporte</Label>
                    <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
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
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleExport} disabled={isExporting}>
                    {isExporting ? "Exportando..." : "Exportar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  )
}