// Reports and analytics utilities and API integration
export interface ReportFilters {
  dateRange: "week" | "month" | "quarter" | "year" | "custom"
  startDate?: string
  endDate?: string
  reportType: "comprehensive" | "expenses" | "income" | "budgets" | "trends"
  categories?: string[]
  accounts?: string[]
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
      const response = await fetch(`${API_BASE_URL}/reports/custom?${new URLSearchParams({
        start_date: filters.startDate || '',
        end_date: filters.endDate || ''
      })}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
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
          categoryBreakdown: data.top_categories,
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
      let endpoint = ''
      
      if (format === 'pdf') {
        if (filters.dateRange === 'week') {
          endpoint = '/reports/generate/weekly_pdf'
        } else if (filters.dateRange === 'month') {
          endpoint = '/reports/generate/monthly_pdf'
        } else {
          endpoint = `/reports/generate/custom_pdf?start_date=${filters.startDate}&end_date=${filters.endDate}`
        }
      } else if (format === 'json') {
        if (filters.dateRange === 'week') {
          endpoint = '/reports/generate/weekly_json'
        } else if (filters.dateRange === 'month') {
          endpoint = '/reports/generate/monthly_json'
        } else {
          endpoint = `/reports/generate/custom_json?start_date=${filters.startDate}&end_date=${filters.endDate}`
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        return await response.blob()
      }
    } catch (error) {
      console.error("Error exporting report:", error)
    }
    return null
  },
}