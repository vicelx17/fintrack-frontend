"use client"

import { useTransaction } from "@/contexts/transaction-context"
import { TransactionDialog } from "./transaction-dialog"

export function TransactionDialogContainer() {
  const { isDialogOpen, closeTransactionDialog, currentTransaction } = useTransaction()

  return (
    <TransactionDialog
      open={isDialogOpen}
      onOpenChange={closeTransactionDialog}
      transaction={currentTransaction}
      onClose={closeTransactionDialog}
    />
  )
}