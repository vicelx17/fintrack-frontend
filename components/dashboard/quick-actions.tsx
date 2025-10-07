"use client"

import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBudget } from "@/lib/budget-context"
import { FileText, Plus, Target } from "lucide-react"
import { useState } from "react"

export function QuickActions() {
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)
  const { openBudgetDialog } = useBudget()

  const actions = [
    {
      title: "Nueva Transacción",
      description: "Registrar ingreso o gasto",
      icon: Plus,
      color: "bg-primary text-primary-foreground",
      action: () => setIsTransactionDialogOpen(true),
    },
    {
      title: "Nuevo Presupuesto",
      description: "Crear meta de gastos",
      icon: Target,
      color: "bg-accent text-accent-foreground",
      action: () => openBudgetDialog(),
    },
    {
      title: "Generar Reporte",
      description: "Exportar datos",
      icon: FileText,
      color: "bg-muted text-muted-foreground",
      action: () => console.log("Generar reporte"),
    },
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action, index) => {
              const Icon = action.icon

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center space-y-2 hover:bg-accent/50 bg-transparent ${
                    index === 0 ? "col-span-2 w-full" : ""
                  }`}
                  onClick={action.action}
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <TransactionDialog
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
        onClose={() => setIsTransactionDialogOpen(false)}
      />
    </>
  )
}