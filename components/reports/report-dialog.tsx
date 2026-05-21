"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Download, FileText, Loader2, Share } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { reportsApi, type ReportFilters } from "@/services/reports-api"

interface ExportReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportReportDialog({ open, onOpenChange }: ExportReportDialogProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const [exportFormat, setExportFormat] = useState<"pdf" | "json">("pdf")
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year" | "custom">("month")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [reportType, setReportType] = useState<"comprehensive" | "expenses" | "income" | "budgets" | "trends">("comprehensive")
  const [transactionLimit, setTransactionLimit] = useState<number | undefined>(undefined)

  const handleExport = async () => {
    setIsExporting(true)

    const filters: ReportFilters = {
      dateRange,
      reportType,
      transactionLimit,
    }

    if (dateRange === "custom" && startDate && endDate) {
      filters.startDate = format(startDate, "yyyy-MM-dd")
      filters.endDate = format(endDate, "yyyy-MM-dd")
    }

    try {
      const blob = await reportsApi.exportReport(filters, exportFormat)

      if (blob) {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const dateStr = new Date().toISOString().split("T")[0]
        a.download = `report-${filters.dateRange}-${dateStr}.${exportFormat}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Reporte exportado",
          description: `El reporte se ha descargado en formato ${exportFormat.toUpperCase()}`,
        })
        onOpenChange(false)
      } else {
        throw new Error("No se pudo generar el archivo")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo exportar el reporte",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generar Reporte</DialogTitle>
          <DialogDescription>
            Configura los parámetros de tu reporte antes de exportar
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Formato */}
          <div className="space-y-2">
            <Label>Formato</Label>
            <Select
              value={exportFormat}
              onValueChange={(value: "pdf" | "json") => setExportFormat(value)}
            >
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

          {/* Período */}
          <div className="space-y-2">
            <Label>Período</Label>
            <Select
              value={dateRange}
              onValueChange={(value: "week" | "month" | "quarter" | "year" | "custom") =>
                setDateRange(value)
              }
            >
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

          {/* Fechas personalizadas */}
          {dateRange === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: es }) : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fecha Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: es }) : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Tipo de reporte */}
          <div className="space-y-2">
            <Label>Tipo de Reporte</Label>
            <Select
              value={reportType}
              onValueChange={(
                value: "comprehensive" | "expenses" | "income" | "budgets" | "trends"
              ) => setReportType(value)}
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

          {/* Límite de transacciones */}
          <div className="space-y-2">
            <Label>Límite de Transacciones</Label>
            <Select
              value={transactionLimit?.toString() || "all"}
              onValueChange={(value) =>
                setTransactionLimit(value === "all" ? undefined : parseInt(value))
              }
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}