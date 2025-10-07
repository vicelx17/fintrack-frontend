import { BudgetAlerts } from "@/components/budgets/budget-alerts"
import { BudgetHeader } from "@/components/budgets/budget-header"
import { BudgetList } from "@/components/budgets/budget-list"
import { BudgetOverview } from "@/components/budgets/budget-overview"
import { CategoryManager } from "@/components/budgets/category-manager"
import { BudgetProvider } from "@/lib/budget-context"

export default function BudgetsPage() {
  return (
    <div className="min-h-screen bg-background">
      <BudgetProvider>
        <BudgetHeader />

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Budget Alerts */}
          <BudgetAlerts />

          {/* Budget Overview */}
          <BudgetOverview />

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Budget List */}
            <div className="lg:col-span-2">
              <BudgetList />
            </div>

            {/* Category Manager */}
            <div>
              <CategoryManager />
            </div>
          </div>
        </main>
      </BudgetProvider>
    </div>
  )
}
