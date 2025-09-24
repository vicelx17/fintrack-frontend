"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Download } from "lucide-react"
import { BudgetDialog } from "./budget-dialog"

export function BudgetHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Presupuestos</h1>
              <p className="text-muted-foreground mt-1">Controla tus gastos y alcanza tus metas financieras</p>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Presupuesto
              </Button>
            </div>
          </div>
        </div>
      </header>

      <BudgetDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}
