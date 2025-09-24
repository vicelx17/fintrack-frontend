"use client"

import { useTransaction } from "@/contexts/transaction-context"
import { TransactionDialog } from "./transaction-dialog"

export function TransactionDialogContainer() {
  const { isDialogOpen, closeDialog, currentTransaction } = useTransaction()

  return (
    <TransactionDialog
      open={isDialogOpen}
      onOpenChange={closeDialog}
      transaction={currentTransaction}
      onClose={closeDialog}
    />
  )
}