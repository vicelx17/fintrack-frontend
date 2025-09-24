import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { TransactionHeader } from "@/components/transactions/transaction-header"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionStats } from "@/components/transactions/transaction-stats"
import { TransactionProvider } from "@/contexts/transaction-context"

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TransactionProvider>
        <TransactionHeader />

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Transaction Statistics */}
          <TransactionStats />

          {/* Filters and Search */}
          <TransactionFilters />

          {/* Transaction List */}
          <TransactionList />
        </main>
      </TransactionProvider>
    </div>
  )
}
