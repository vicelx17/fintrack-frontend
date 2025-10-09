import { budgetEvents } from "../lib/budget-events"

export interface Budget {
  id: string
  userId: string
  category: string
  budgetAmount: number
  spentAmount: number
  period: string
  startDate: string
  endDate: string
  alertThreshold: number
  status: "good" | "warning" | "over"
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
  category: string
  message: string
  severity: "low" | "medium" | "high"
  dismissed: boolean
}

export interface BudgetOverview {
  totalBudget: number
  totalSpent: number
  available: number
  percentageUsed: number
  budgetsExceeded: number
  totalBudgets: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function getAuthHeaders() {
  const token = localStorage.getItem("fintrack_token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Network error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.detail || `HTTP ${response.status}`)
  }
  const data = await response.json()
  console.log("API Response Data:", data)
  return data
} 

export const budgetApi = {
  
  async getBudgets(): Promise<Budget[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets`, {
        headers: getAuthHeaders(),
      })
      console.log("Response:", response)
      return await handleResponse<Budget[]>(response)
    } catch (error) {
      console.error("Error fetching budgets:", error)
      throw error
    }
  },

  async getBudget(id: string): Promise<Budget> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
        headers: getAuthHeaders(),
      })
      return await handleResponse<Budget>(response)
    } catch (error) {
      console.error("Error fetching budget:", error)
      throw error
    }
  },

  async createBudget(budgetData: {
    name: string
    category: string
    budgetAmount: number
    period: string
    startDate: string
    endDate: string
    alertThreshold: number
    category_id: number
  }): Promise<Budget> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: budgetData.name,
          amount: budgetData.budgetAmount,
          category_id: budgetData.category_id,
          start_date: budgetData.startDate,
          end_date: budgetData.endDate,
          period: budgetData.period,
          alert_threshold: budgetData.alertThreshold,
        }),
      })
      console.log("Response:", response)
      const budget = await handleResponse<Budget>(response)
      budgetEvents.emit('budget-created')
      return budget
    } catch (error) {
      console.error("Error creating budget:", error)
      throw error
    }
  },

  async updateBudget(id: string, budgetData: {
    name: string
    category: string
    budgetAmount: number
    period: string
    startDate: string
    endDate: string
    alertThreshold: number
    category_id: number
  }): Promise<Budget> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: budgetData.name,
          amount: budgetData.budgetAmount,
          category_id: budgetData.category_id,
          start_date: budgetData.startDate,
          end_date: budgetData.endDate,
          period: budgetData.period,
          alert_threshold: budgetData.alertThreshold,
        }),
      })
      const budget = await handleResponse<Budget>(response)
      budgetEvents.emit('budget-updated')
      return budget
    } catch (error) {
      console.error("Error updating budget:", error)
      throw error
    }
  },

  async deleteBudget(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      console.log("DELETE RESPONSE🗑️:", response)
      return await handleResponse<{ success: boolean; message: string }>(response)
    } catch (error) {
      console.error("Error deleting budget:", error)
      throw error
    }
  },

  async getBudgetAlerts(): Promise<BudgetAlert[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/alerts`, {
        headers: getAuthHeaders(),
      })
      const data = await handleResponse<{ alerts: BudgetAlert[] }>(response)
      return data.alerts
    } catch (error) {
      console.error("Error fetching budget alerts:", error)
      throw error
    }
  },

  async getBudgetOverview(): Promise<BudgetOverview> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/overview`, {
        headers: getAuthHeaders(),
      })
      const data = await handleResponse<{ overview: BudgetOverview }>(response)
      return data.overview
    } catch (error) {
      console.error("Error fetching budget overview:", error)
      throw error
    }
  },

  async getBudgetAnalytics(period: string = "monthly"): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/analytics?period=${period}`, {
        headers: getAuthHeaders(),
      })
      const data = await handleResponse<{ analytics: any }>(response)
      return data.analytics
    } catch (error) {
      console.error("Error fetching budget analytics:", error)
      throw error
    }
  },

  async dismissAlert(alertId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/budgets/alerts/${alertId}/dismiss`, {
        method: "POST",
        headers: getAuthHeaders(),
      })
      await handleResponse<void>(response)
    } catch (error) {
      console.error("Error dismissing alert:", error)
      throw error
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: getAuthHeaders(),
      })
      const data = await handleResponse<{ categories: Category[] }>(response)
      return data.categories || []
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  },

  async createCategory(categoryData: {
    name: string
    color: string
    icon?: string
  }): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      })
      const data = await handleResponse<{ category: Category }>(response)
      return data.category
    } catch (error) {
      console.error("Error creating category:", error)
      throw error
    }
  },

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      })
      const data = await handleResponse<{ category: Category }>(response)
      return data.category
    } catch (error) {
      console.error("Error updating category:", error)
      throw error
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      await handleResponse<void>(response)
    } catch (error) {
      console.error("Error deleting category:", error)
      throw error
    }
  },
}

export default budgetApi