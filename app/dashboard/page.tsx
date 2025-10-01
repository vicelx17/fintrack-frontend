"use client"
import { BudgetDialogContainer } from "@/components/budgets/budget-dialog-container"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { BudgetOverview } from "@/components/dashboard/budget-overview"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ExpenseChart } from "@/components/dashboard/expense-chart"
import { FinancialSummary } from "@/components/dashboard/financial-summary"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { TransactionDialogContainer } from "@/components/transactions/transaction-dialog-container"
import { BudgetProvider } from "@/contexts/budget-context"
import { TransactionProvider } from "@/contexts/transaction-context"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Financial Summary Cards */}
        <FinancialSummary />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            <ExpenseChart />
            <RecentTransactions />
          </div>

          {/* Right Column - Sidebar */}
          <TransactionProvider>
            <BudgetProvider>
              <div className="space-y-6">
                <QuickActions />

                <BudgetOverview />
                <AIInsights />
                <TransactionDialogContainer />
                <BudgetDialogContainer />
              </div>
            </BudgetProvider>
          </TransactionProvider>
        </div>
      </main>
    </div>
  )
}
