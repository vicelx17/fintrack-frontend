"use client"

import { createContext, ReactNode, useContext, useState } from 'react'

interface BudgetContextType {
  isDialogOpen: boolean
  openBudgetDialog: (Budget?: any) => void
  closeBudgetDialog: () => void
  currentBudget: any | null
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

interface BudgetProviderProps {
  children: ReactNode
}

export function BudgetProvider({ children }: BudgetProviderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentBudget, setCurrentBudget] = useState<any | null>(null)

  const openBudgetDialog = (Budget?: any) => {
    setCurrentBudget(Budget || null)
    setIsDialogOpen(true)
  }

  const closeBudgetDialog = () => {
    setIsDialogOpen(false)
    setCurrentBudget(null)
  }

  return (
    <BudgetContext.Provider value={{
      isDialogOpen,
      openBudgetDialog,
      closeBudgetDialog,
      currentBudget
    }}>
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget() {
  const context = useContext(BudgetContext)
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider')
  }
  return context
}