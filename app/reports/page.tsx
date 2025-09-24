import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportFilters } from "@/components/reports/report-filters"
import { FinancialOverview } from "@/components/reports/financial-overview"
import { ExpenseAnalysis } from "@/components/reports/expense-analysis"
import { IncomeAnalysis } from "@/components/reports/income-analysis"
import { TrendAnalysis } from "@/components/reports/trend-analysis"
import { CategoryBreakdown } from "@/components/reports/category-breakdown"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <ReportsHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Report Filters */}
        <ReportFilters />

        {/* Financial Overview */}
        <FinancialOverview />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Expense Analysis */}
          <ExpenseAnalysis />

          {/* Income Analysis */}
          <IncomeAnalysis />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trend Analysis */}
          <div className="lg:col-span-2">
            <TrendAnalysis />
          </div>

          {/* Category Breakdown */}
          <CategoryBreakdown />
        </div>
      </main>
    </div>
  )
}
