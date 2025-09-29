// Transaction management utilities and API integration
export interface Transaction {
  id: string
  userId: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  account: string
  date: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface TransactionFilters {
  search?: string
  category?: string
  type?: "income" | "expense"
  dateRange?: string
  account?: string
  minAmount?: number
  maxAmount?: number
}

export interface TransactionStats {
  totalTransactions: number
  totalIncome: number
  totalExpenses: number
  averageDaily: number
  categoryBreakdown: { category: string; amount: number }[]
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export class TransactionService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("fintrack_token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  static async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
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
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.transactions || []
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }

    return []
  }

  static async getTransaction(id: string): Promise<Transaction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.transaction
      }
    } catch (error) {
      console.error("Error fetching transaction:", error)
    }

    return null
  }

  static async createTransaction(
    transactionData: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">,
  ): Promise<Transaction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(transactionData),
      })

      if (response.ok) {
        const data = await response.json()
        return data.transaction
      }
    } catch (error) {
      console.error("Error creating transaction:", error)
    }

    return null
  }

  static async updateTransaction(id: string, transactionData: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(transactionData),
      })

      if (response.ok) {
        const data = await response.json()
        return data.transaction
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
    }

    return null
  }

  static async deleteTransaction(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      return response.ok
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }

    return false
  }

  static async getTransactionStats(dateRange?: string): Promise<TransactionStats | null> {
    try {
      const queryParams = dateRange ? `?dateRange=${dateRange}` : ""
      const response = await fetch(`${API_BASE_URL}/transactions/stats${queryParams}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.stats
      }
    } catch (error) {
      console.error("Error fetching transaction stats:", error)
    }

    return null
  }

  static async importTransactions(file: File): Promise<{ success: boolean; imported: number; errors: string[] }> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/transactions/import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("fintrack_token")}`,
        },
        body: formData,
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error("Error importing transactions:", error)
    }

    return { success: false, imported: 0, errors: ["Error de conexión"] }
  }

  static async exportTransactions(format: "csv" | "json" | "pdf", filters?: TransactionFilters): Promise<Blob | null> {
    try {
      const queryParams = new URLSearchParams({ format })

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            queryParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(`${API_BASE_URL}/transactions/export?${queryParams.toString()}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        return await response.blob()
      }
    } catch (error) {
      console.error("Error exporting transactions:", error)
    }

    return null
  }
}
