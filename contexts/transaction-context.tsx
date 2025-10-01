"use client"

import { createContext, ReactNode, useContext, useState } from 'react'

interface TransactionContextType {
  isDialogOpen: boolean
  openTransactionDialog: (transaction?: any) => void
  closeTransactionDialog: () => void
  currentTransaction: any | null
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

interface TransactionProviderProps {
  children: ReactNode
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState<any | null>(null)

  const openTransactionDialog = (transaction?: any) => {
    setCurrentTransaction(transaction || null)
    setIsDialogOpen(true)
  }

  const closeTransactionDialog = () => {
    setIsDialogOpen(false)
    setCurrentTransaction(null)
  }

  return (
    <TransactionContext.Provider value={{
      isDialogOpen,
      openTransactionDialog,
      closeTransactionDialog,
      currentTransaction
    }}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransaction() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider')
  }
  return context
}