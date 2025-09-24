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

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export class ReportsService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("fintrack_token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  static async generateReport(filters: ReportFilters): Promise<ReportData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/generate`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(filters),
      })

      if (response.ok) {
        const data = await response.json()
        return data.report
      }
    } catch (error) {
      console.error("Error generating report:", error)
    }

    return null
  }

  static async getFinancialSummary(period: string): Promise<FinancialSummary | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/summary?period=${period}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.summary
      }
    } catch (error) {
      console.error("Error fetching financial summary:", error)
    }

    return null
  }

  static async getExpenseAnalysis(period: string): Promise<CategoryAnalysis[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/expenses?period=${period}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.analysis || []
      }
    } catch (error) {
      console.error("Error fetching expense analysis:", error)
    }

    return []
  }

  static async getIncomeAnalysis(period: string): Promise<CategoryAnalysis[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/income?period=${period}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.analysis || []
      }
    } catch (error) {
      console.error("Error fetching income analysis:", error)
    }

    return []
  }

  static async getTrendAnalysis(period: string, granularity: "daily" | "weekly" | "monthly"): Promise<TrendData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/trends?period=${period}&granularity=${granularity}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.trends || []
      }
    } catch (error) {
      console.error("Error fetching trend analysis:", error)
    }

    return []
  }

  static async exportReport(filters: ReportFilters, format: "pdf" | "csv" | "json"): Promise<Blob | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/export`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ...filters, format }),
      })

      if (response.ok) {
        return await response.blob()
      }
    } catch (error) {
      console.error("Error exporting report:", error)
    }

    return null
  }

  static async scheduleReport(
    filters: ReportFilters,
    schedule: {
      frequency: "daily" | "weekly" | "monthly"
      email: string
      format: "pdf" | "csv"
    },
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/schedule`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ filters, schedule }),
      })

      return response.ok
    } catch (error) {
      console.error("Error scheduling report:", error)
    }

    return false
  }

  static async getScheduledReports(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/scheduled`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.reports || []
      }
    } catch (error) {
      console.error("Error fetching scheduled reports:", error)
    }

    return []
  }

  static async deleteScheduledReport(reportId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/scheduled/${reportId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      return response.ok
    } catch (error) {
      console.error("Error deleting scheduled report:", error)
    }

    return false
  }
}
