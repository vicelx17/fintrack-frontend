"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { TransactionDialog } from "./transaction-dialog"

export function TransactionHeader() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Transacciones</h1>
              <p className="text-muted-foreground mt-1">Gestiona todos tus ingresos y gastos</p>
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
                  onClick={() => router.push("/budgets")}
                >
                  Presupuestos
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
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Volver al Dashboard
              </Button>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Transacción
              </Button>
            </div>
          </div>
        </div>
      </header>

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
      />
    </>
  )
}