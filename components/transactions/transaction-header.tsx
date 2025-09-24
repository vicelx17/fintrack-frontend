"use client"

import { Button } from "@/components/ui/button"
import { useTransaction } from "@/contexts/transaction-context"
import { Download, Plus, Upload } from "lucide-react"

export function TransactionHeader() {
  const { openDialog } = useTransaction()

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transacciones</h1>
            <p className="text-muted-foreground mt-1">Gestiona todos tus ingresos y gastos</p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Transacción
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}