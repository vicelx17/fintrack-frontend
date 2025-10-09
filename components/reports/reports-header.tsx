"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Download, FileSpreadsheet, FileText, Share } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function ReportsHeader() {
  const [isExporting, setIsExporting] = useState(false)
  const router = useRouter()

  const handleExport = async (format: "pdf" | "csv" | "json") => {
    setIsExporting(true)
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      console.log(`Exporting report as ${format}`)
    }, 2000)
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
                className="text-primary font-medium"
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
                onClick={() => router.push("/ai-insights")}
              >
                IA Financiera
              </Button>
            </div>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Programar Reporte
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={isExporting}>
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? "Exportando..." : "Exportar"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar como PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Exportar como CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")}>
                  <Share className="mr-2 h-4 w-4" />
                  Exportar como JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
