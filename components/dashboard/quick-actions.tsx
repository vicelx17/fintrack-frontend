"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransaction } from "@/contexts/transaction-context"
import { FileText, Plus, Target } from "lucide-react"

export function QuickActions() {
  const { openDialog } = useTransaction()

  const actions = [
    {
      title: "Nueva Transacción",
      description: "Registrar ingreso o gasto",
      icon: Plus,
      color: "bg-primary text-primary-foreground",
      action: () => openDialog(), // Usa el contexto
    },
    {
      title: "Nuevo Presupuesto",
      description: "Crear meta de gastos",
      icon: Target,
      color: "bg-accent text-accent-foreground",
      action: () => console.log("Nuevo presupuesto"),
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
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-accent/50 bg-transparent"
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
  )
}