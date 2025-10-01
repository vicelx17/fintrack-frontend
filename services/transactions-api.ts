// Transaction management utilities and API integration
export interface Transaction {
  id: string
  userId: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  account: string
  transaction_date: string
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

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}

// API Base URL
const API_BASE_URL = "http://localhost:8000"

function getAuthHeaders() {
  const token = localStorage.getItem('fintrack_token');
  console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    console.log('Response status:', response.status);
    console.log('Response URL:', response.url);
    const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
    console.error('API Error:', errorData);
    throw new Error(errorData.detail || 'HTPP ${response.status}');
  }
  const data = await response.json();
  return data;
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

      if (response.ok) {
        const data = await response.json()
        return data.transactions || []
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }

    return []
  },

  async getTransaction(id: string): Promise<Transaction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.transaction
      }
    } catch (error) {
      console.error("Error fetching transaction:", error)
    }

    return null
  },

  async createTransaction(
    transactionData: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">,
  ): Promise<Transaction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: getAuthHeaders(),
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
        return data.transaction
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

  async getTransactionStats(dateRange?: string): Promise<TransactionStats | null> {
    try {
      const queryParams = dateRange ? `?dateRange=${dateRange}` : ""
      const response = await fetch(`${API_BASE_URL}/transactions/stats${queryParams}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.stats
      }
    } catch (error) {
      console.error("Error fetching transaction stats:", error)
    }

    return null
  },

  async importTransactions(file: File): Promise<{ success: boolean; imported: number; errors: string[] }> {
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
  },

  async exportTransactions(format: "csv" | "json" | "pdf", filters?: TransactionFilters): Promise<Blob | null> {
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
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        return await response.blob()
      }
    } catch (error) {
      console.error("Error exporting transactions:", error)
    }

    return null
  },

  async getCompleteTransaction(): Promise< {
    transaction_summary: TransactionStats;
    filters: TransactionFilters;
    transacions: Transaction;
  } > {
      const response = await fetch(`${API_BASE_URL}/transactions/complete`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const result = await handleResponse<ApiResponse<any>>(response);
      return result.data;
    }
  };

export default transactionsApi;
