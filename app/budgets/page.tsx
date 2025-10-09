"use client"

import { BudgetAlerts } from "@/components/budgets/budget-alerts"
import { BudgetHeader } from "@/components/budgets/budget-header"
import { BudgetList } from "@/components/budgets/budget-list"
import { BudgetOverview } from "@/components/budgets/budget-overview"
import { CategoryManager } from "@/components/budgets/category-manager"
import { useBudgets } from "@/hooks/use-budgets"
import { Loader2 } from "lucide-react"

export default function BudgetsPage() {
  const { isAnyLoading, hasAnyError, allErrors } = useBudgets()

  return (
    <div className="min-h-screen bg-background">
      <BudgetHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Error State */}
        {hasAnyError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
            <p className="font-semibold">Error cargando datos:</p>
            <ul className="list-disc list-inside">
              {allErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Loading State */}
        {isAnyLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Cargando presupuestos...</span>
          </div>
        )}
        
        <BudgetAlerts />
        <BudgetOverview />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BudgetList />
          </div>
          <div>
            <CategoryManager />
          </div>
        </div>
      </main>
    </div>
  )
}