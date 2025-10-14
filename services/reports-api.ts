export interface ReportFilters {
  dateRange: "week" | "month" | "quarter" | "year" | "custom"
  startDate?: string
  endDate?: string
  reportType: "comprehensive" | "expenses" | "income" | "budgets" | "trends"
  categories?: string[]
  transactionLimit?: number
}

export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  savingsRate: number
  averageDailySpending: number
  budgetCompliance: number
  period: string
}

export interface CategoryAnalysis {
  category: string
  amount: number
  percentage: number
  trend: "up" | "down"
  change: number
  budgetAmount?: number
  previousAmount?: number
}

export interface TrendData {
  period: string
  income: number
  expenses: number
  balance: number
  savings?: number
}

export interface ReportData {
  summary: FinancialSummary
  expenseAnalysis: CategoryAnalysis[]
  incomeAnalysis: CategoryAnalysis[]
  trends: TrendData[]
  categoryBreakdown: CategoryAnalysis[]
  generatedAt: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const getAuthHeaders = () => {
  const token = localStorage.getItem("fintrack_token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export const reportsApi = {
  async generateReport(filters: ReportFilters): Promise<ReportData | null> {
    try {
      const params = new URLSearchParams()

      if (filters.startDate) params.append('start_date', filters.startDate)
      if (filters.endDate) params.append('end_date', filters.endDate)

      const response = await fetch(`${API_BASE_URL}/reports/custom?${params}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()

        // Transform backend response to frontend format
        return {
          summary: {
            totalIncome: data.total_income,
            totalExpenses: data.total_expenses,
            netBalance: data.net_balance,
            savingsRate: 0,
            averageDailySpending: 0,
            budgetCompliance: 0,
            period: filters.dateRange
          },
          expenseAnalysis: [],
          incomeAnalysis: [],
          trends: [],
          categoryBreakdown: data.top_categories.map((cat: any) => ({
            category: cat.category,
            amount: Math.abs(cat.net_category_balance),
            percentage: 0,
            trend: "up" as const,
            change: 0
          })),
          generatedAt: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error("Error generating report:", error)
    }
    return null
  },

  async getFinancialSummary(period: string): Promise<FinancialSummary | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/summary?period=${period}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.summary
      }
    } catch (error) {
      console.error("Error fetching financial summary:", error)
    }
    return null
  },

  async getExpenseAnalysis(period: string): Promise<CategoryAnalysis[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/expenses?period=${period}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.analysis || []
      }
    } catch (error) {
      console.error("Error fetching expense analysis:", error)
    }
    return []
  },

  async getIncomeAnalysis(period: string): Promise<CategoryAnalysis[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/income?period=${period}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.analysis || []
      }
    } catch (error) {
      console.error("Error fetching income analysis:", error)
    }
    return []
  },

  async getTrendAnalysis(period: string, granularity: "daily" | "weekly" | "monthly"): Promise<TrendData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/trends?period=${period}&granularity=${granularity}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.trends || []
      }
    } catch (error) {
      console.error("Error fetching trend analysis:", error)
    }
    return []
  },

  async exportReport(filters: ReportFilters, format: "pdf" | "csv" | "json"): Promise<Blob | null> {
    try {
      const body: any = {
        dateRange: filters.dateRange,
        format: format,
        reportType: filters.reportType
      }

      if (filters.dateRange === "custom" && filters.startDate && filters.endDate) {
        body.startDate = filters.startDate
        body.endDate = filters.endDate
      }

      if (filters.categories && filters.categories.length > 0) {
        body.categories = filters.categories
      }

      console.log("Sending export request with body:", body)

      const response = await fetch(`${API_BASE_URL}/reports/export`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      })

      if (response.ok) {
        return await response.blob()
      } else {
        const errorText = await response.text()
        console.error("Export error:", errorText)
        throw new Error(`Error al exportar: ${response.status}`)
      }
    } catch (error) {
      console.error("Error exporting report:", error)
      throw error
    }
  }
}