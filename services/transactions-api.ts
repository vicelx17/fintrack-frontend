export interface Transaction {
  id: string
  userId: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  transactionDate: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface TransactionCreate {
  type: "income" | "expense"
  amount: number
  description: string
  category_id: number
  transaction_date?: string
  notes?: string
}

export interface TransactionFilters {
  search?: string
  category?: string
  type?: "income" | "expense"
  dateRange?: string
  minAmount?: number
  maxAmount?: number
}

export interface TransactionStats {
  totalTransactions: number
  totalIncome: number
  totalExpenses: number
  averageDaily: number
}

export interface CategoryBreakdown {
  category: string
  amount: number
  type: "income" | "expense"
}

const API_BASE_URL = "http://localhost:8000"

function getAuthHeaders() {
  const token = localStorage.getItem('fintrack_token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Network error' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.detail || `HTTP ${response.status}`)
  }
  const data = await response.json()
  return data
}

export const transactionsApi = {
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    try {
      const queryParams = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            queryParams.append(key, value.toString())
          }
        })
      }
      
      const response = await fetch(`${API_BASE_URL}/transactions/?${queryParams.toString()}`, {
        headers: getAuthHeaders(),
      })

      return await handleResponse<Transaction[]>(response)
      
    } catch (error) {
      console.error("Error fetching transactions:", error)
      throw error
    }
  },

  async getTransactionStats(dateRange?: string): Promise<TransactionStats> {
    try {
      const queryParams = dateRange ? `?dateRange=${dateRange}` : ""
      const response = await fetch(`${API_BASE_URL}/transactions/stats${queryParams}`, {
        headers: getAuthHeaders(),
      })
      return await handleResponse<TransactionStats>(response)
    } catch (error) {
      console.error("Error fetching transaction stats:", error)
      throw error
    }
  },

  async getCategoryBreakdown(dateRange?: string): Promise<CategoryBreakdown[]> {
    try {
      const queryParams = dateRange ? `?dateRange=${dateRange}` : ""
      const response = await fetch(`${API_BASE_URL}/transactions/category-breakdown${queryParams}`, {
        headers: getAuthHeaders(),
      })
      return await handleResponse<CategoryBreakdown[]>(response)
    } catch (error) {
      console.error("Error fetching category breakdown:", error)
      throw error
    }
  },

  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        headers: getAuthHeaders(),
      })
      return await handleResponse<Transaction>(response)
    } catch (error) {
      console.error("Error fetching transaction:", error)
      throw error
    }
  },

  async createTransaction(transactionData: TransactionCreate): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData),
      })
      return await handleResponse<Transaction>(response)
    } catch (error) {
      console.error("Error creating transaction:", error)
      throw error
    }
  },

  async updateTransaction(id: string, transactionData: Partial<TransactionCreate>): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData),
      })
      return await handleResponse<Transaction>(response)
    } catch (error) {
      console.error("Error updating transaction:", error)
      throw error
    }
  },

  async deleteTransaction(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      return await handleResponse<{ success: boolean; message: string }>(response)
    } catch (error) {
      console.error("Error deleting transaction:", error)
      throw error
    }
  },
}

export default transactionsApi