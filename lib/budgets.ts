// Budget management utilities and API integration
export interface Budget {
  id: string
  userId: string
  category: string
  budgetAmount: number
  spentAmount: number
  period: "weekly" | "monthly" | "quarterly" | "yearly"
  startDate: string
  endDate: string
  alertThreshold: number
  status: "good" | "warning" | "over"
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  userId: string
  name: string
  color: string
  icon?: string
  transactionCount: number
  createdAt: string
  updatedAt: string
}

export interface BudgetAlert {
  id: string
  budgetId: string
  type: "warning" | "exceeded" | "approaching"
  message: string
  severity: "low" | "medium" | "high"
  dismissed: boolean
  createdAt: string
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export class BudgetService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("fintrack_token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  // Budget Management
  static async getBudgets(): Promise<Budget[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.budgets || []
      }
    } catch (error) {
      console.error("Error fetching budgets:", error)
    }

    return []
  }

  static async getBudget(id: string): Promise<Budget | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.budget
      }
    } catch (error) {
      console.error("Error fetching budget:", error)
    }

    return null
  }

  static async createBudget(
    budgetData: Omit<Budget, "id" | "userId" | "spentAmount" | "status" | "createdAt" | "updatedAt">,
  ): Promise<Budget | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(budgetData),
      })

      if (response.ok) {
        const data = await response.json()
        return data.budget
      }
    } catch (error) {
      console.error("Error creating budget:", error)
    }

    return null
  }

  static async updateBudget(id: string, budgetData: Partial<Budget>): Promise<Budget | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(budgetData),
      })

      if (response.ok) {
        const data = await response.json()
        return data.budget
      }
    } catch (error) {
      console.error("Error updating budget:", error)
    }

    return null
  }

  static async deleteBudget(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      return response.ok
    } catch (error) {
      console.error("Error deleting budget:", error)
    }

    return false
  }

  // Category Management
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.categories || []
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }

    return []
  }

  static async createCategory(
    categoryData: Omit<Category, "id" | "userId" | "transactionCount" | "createdAt" | "updatedAt">,
  ): Promise<Category | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoryData),
      })

      if (response.ok) {
        const data = await response.json()
        return data.category
      }
    } catch (error) {
      console.error("Error creating category:", error)
    }

    return null
  }

  static async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoryData),
      })

      if (response.ok) {
        const data = await response.json()
        return data.category
      }
    } catch (error) {
      console.error("Error updating category:", error)
    }

    return null
  }

  static async deleteCategory(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      return response.ok
    } catch (error) {
      console.error("Error deleting category:", error)
    }

    return false
  }

  // Budget Alerts
  static async getBudgetAlerts(): Promise<BudgetAlert[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/alerts`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.alerts || []
      }
    } catch (error) {
      console.error("Error fetching budget alerts:", error)
    }

    return []
  }

  static async dismissAlert(alertId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/alerts/${alertId}/dismiss`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })

      return response.ok
    } catch (error) {
      console.error("Error dismissing alert:", error)
    }

    return false
  }

  // Budget Analytics
  static async getBudgetAnalytics(period?: string): Promise<any> {
    try {
      const queryParams = period ? `?period=${period}` : ""
      const response = await fetch(`${API_BASE_URL}/budgets/analytics${queryParams}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.analytics
      }
    } catch (error) {
      console.error("Error fetching budget analytics:", error)
    }

    return null
  }
}
