// Transaction management utilities and API integration
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
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
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
      
      const response = await fetch(`${API_BASE_URL}/transactions?${queryParams.toString()}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (Array.isArray(data)) {
        return data
      }
      
      if (data.transactions && Array.isArray(data.transactions)) {
        return data.transactions
      }
      
      return []
      
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
      const result = await handleResponse<ApiResponse<TransactionStats>>(response)
      return result.data
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
      const result = await handleResponse<ApiResponse<CategoryBreakdown[]>>(response)
      return result.data
    } catch (error) {
      console.error("Error fetching category breakdown:", error)
      throw error
    }
  },

  async getCompleteTransactions(filters?: TransactionFilters): Promise<{
    transactions: Transaction[]
    stats: TransactionStats
    category_breakdown: CategoryBreakdown[]
  }> {
    try {
      const queryParams = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            queryParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(`${API_BASE_URL}/transactions/complete?${queryParams.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })
      
      const result = await handleResponse<ApiResponse<any>>(response)
      return result.data
    } catch (error) {
      console.error("Error fetching complete transactions:", error)
      throw error
    }
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.transaction || data
      }
    } catch (error) {
      console.error("Error fetching transaction:", error)
    }

    return null
  },

  async createTransaction(transactionData: TransactionCreate): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData),
      })

      const result = await handleResponse<Transaction>(response)
      return result
    } catch (error) {
      console.error("Error creating transaction:", error)
      throw error
    }
  },

  async updateTransaction(id: string, transactionData: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData),
      })

      if (response.ok) {
        const data = await response.json()
        return data.transaction || data
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
    }

    return null
  },

  async deleteTransaction(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      return response.ok
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }

    return false
  },
}

export default transactionsApi