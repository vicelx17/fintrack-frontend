"use client"

import { useBudget } from "@/contexts/budget-context"
import { BudgetDialog } from "./budget-dialog"

export function BudgetDialogContainer() {
  const { isDialogOpen, closeBudgetDialog, currentBudget } = useBudget()

  return (
    <BudgetDialog
      open={isDialogOpen}
      onOpenChange={closeBudgetDialog}
      budget={currentBudget}
      onClose={closeBudgetDialog}
    />
  )
}