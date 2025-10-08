"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import { BudgetDialog } from "./budget-dialog"

const mockBudgets = [
  {
    id: "1",
    category: "Alimentación",
    budgetAmount: 1000,
    spentAmount: 850,
    period: "monthly",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "good",
  },
  {
    id: "2",
    category: "Transporte",
    budgetAmount: 500,
    spentAmount: 420,
    period: "monthly",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "good",
  },
  {
    id: "3",
    category: "Entretenimiento",
    budgetAmount: 300,
    spentAmount: 320,
    period: "monthly",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "over",
  },
  {
    id: "4",
    category: "Servicios",
    budgetAmount: 700,
    spentAmount: 680,
    period: "monthly",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "warning",
  },
  {
    id: "5",
    category: "Compras",
    budgetAmount: 400,
    spentAmount: 280,
    period: "monthly",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "good",
  },
  {
    id: "6",
    category: "Salud",
    budgetAmount: 200,
    spentAmount: 80,
    period: "monthly",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "good",
  },
  {
    id: "7",
    category: "Educación",
    budgetAmount: 300,
    spentAmount: 150,
    period: "monthly",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "good",
  },
  {
    id: "8",
    category: "Otros",
    budgetAmount: 100,
    spentAmount: 70,
    period: "monthly",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "good",
  },
]

export function BudgetList() {
  const [editingBudget, setEditingBudget] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEdit = (budget: any) => {
    setEditingBudget(budget)
    setIsDialogOpen(true)
  }

  const handleDelete = (budgetId: string) => {
    console.log("Delete budget:", budgetId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="w-4 h-4 text-primary" />
      case "warning":
        return <Clock className="w-4 h-4 text-secondary" />
      case "over":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge className="bg-primary/10 text-primary border-primary/20">En Control</Badge>
      case "warning":
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Cerca del Límite</Badge>
      case "over":
        return <Badge variant="destructive">Excedido</Badge>
      default:
        return null
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Presupuestos Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockBudgets.map((budget) => {
              const percentage = (budget.spentAmount / budget.budgetAmount) * 100
              const remaining = budget.budgetAmount - budget.spentAmount

              return (
                <div key={budget.id} className="p-4 rounded-lg border bg-card/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(budget.status)}
                      <div>
                        <h3 className="font-semibold">{budget.category}</h3>
                        <p className="text-sm text-muted-foreground">
                          Período: {new Date(budget.startDate).toLocaleDateString("es-ES")} -{" "}
                          {new Date(budget.endDate).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(budget.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(budget)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(budget.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Gastado: €{budget.spentAmount.toFixed(2)}</span>
                      <span>Presupuesto: €{budget.budgetAmount.toFixed(2)}</span>
                    </div>
                    <Progress value={Math.min(percentage, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{percentage.toFixed(1)}% usado</span>
                      <span className={remaining < 0 ? "text-destructive" : ""}>
                        €{Math.abs(remaining).toFixed(2)} {remaining < 0 ? "excedido" : "restante"}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <BudgetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        budget={editingBudget}
        onClose={() => {
          setEditingBudget(null)
          setIsDialogOpen(false)
        }}
      />
    </>
  )
}
