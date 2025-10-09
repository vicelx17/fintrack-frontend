"use client"

import { Button } from "@/components/ui/button"
import { useBudgets } from "@/hooks/use-budgets"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BudgetDialog } from "./budget-dialog"

export function BudgetHeader() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { refreshAll } = useBudgets()

  return (
    <>
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Presupuestos</h1>
              <p className="text-muted-foreground mt-1">Controla tus gastos y alcanza tus metas financieras</p>
            </div>

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
                  onClick={() => router.push("/reports")}
                >
                  Reportes
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
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Presupuesto
              </Button>
            </div>
          </div>
        </div>
      </header>

      <BudgetDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}
        onClose={refreshAll} />
    </>
  )
}
