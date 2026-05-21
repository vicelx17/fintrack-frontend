"use client"

import { AuthProvider } from "@/components/auth/auth-provider"
import { CategoryBreakdown } from "@/components/transactions/transaction-category-breakdown"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { TransactionHeader } from "@/components/transactions/transaction-header"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionStats } from "@/components/transactions/transaction-stats"
import type { TransactionFilters as ITransactionFilters } from "@/services/transactions-api"
import { useState } from "react"

export default function TransactionsPage() {
  const [filters, setFilters] = useState<ITransactionFilters>({})

  const handleFiltersChange = (newFilters: ITransactionFilters) => {
    setFilters(newFilters)
  }

  return (
    <AuthProvider protected>
      <div className="min-h-screen bg-background">
        <TransactionHeader />

        <main className="container mx-auto px-4 py-8 space-y-8">
          <TransactionStats filters={filters} />
          <TransactionFilters onFiltersChange={handleFiltersChange} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TransactionList filters={filters} />
            </div>
            <div className="lg:col-span-1">
              <CategoryBreakdown filters={filters} />
            </div>
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}