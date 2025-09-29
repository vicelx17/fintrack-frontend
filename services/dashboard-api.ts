
export interface FinancialSummary {
    total_balance: number;
    monthly_income: number;
    monthly_expenses: number;
    saving: number;
    changes: {
        balance: number;
        income: number;
        expenses: number;
        savings: number;
    };
}

export interface MonthlyData {
    month: string;
    incomes: number;
    expenses: number;
    balance: number;
}

export interface CategoryData {
    category: string;
    amount: number;
}

export interface RecentTransaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

export interface BudgetOverview {
    category: string;
    spent: number;
    budget: number;
    percentage: number;
    ramaining: number;
    status: 'good' | 'warning' | 'over';
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}

const API_BASE_URL = 'http://localhost:8000'

function getAuthHeaders() {
    const token = localStorage.getItem('fintrack_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({detail: 'Network error'}));
        throw new Error(errorData.detail || 'HTPP ${response.status}');    
    }
    const data = await response.json();
    return data;
}

export const dashboardApi = {
    // Obetener resumen financiero
    async getFinancialSummary(): Promise<FinancialSummary> {
        const response = await fetch(`${API_BASE_URL}/dashboard/financial-summary`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const result = await handleResponse<ApiResponse<FinancialSummary>>(response);
        return result.data;
    },

    // Obtener datos mensuales para gráficos
    async getMonthlyData(months: number = 6): Promise<MonthlyData[]> {
        const response = await fetch(`${API_BASE_URL}/dashboard/monthly-data?months=${months}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const result = await handleResponse<ApiResponse<MonthlyData[]>>(response);
        return result.data;
    },

    async getCategoryData(): Promise<CategoryData[]> {
        const response = await fetch(`${API_BASE_URL}/dashboard/category-data`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const result = await handleResponse<ApiResponse<CategoryData[]>>(response);
        return result.data;
    },

    // Obtener transacciones recientes
    async getRecentTransactions(limit: number = 10): Promise<RecentTransaction[]> {
        const response = await fetch(`${API_BASE_URL}/dashboard/recent-transactions?limit=${limit}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const result = await handleResponse<ApiResponse<RecentTransaction[]>>(response);
        return result.data;
    },

    // Obtener resumen de presupuestos
    async getBudgetOverview(): Promise<BudgetOverview[]> {
        const response = await fetch(`${API_BASE_URL}/dashboard/budget-overview`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const result = await handleResponse<ApiResponse<BudgetOverview[]>>(response);
        return result.data;
    },

    // TODO EL ENDPOINT EN UNA LLAMADA
    async getCompleteDashboard(): Promise<{
    financial_summary: FinancialSummary;
    monthly_chart: MonthlyData[];
    category_chart: CategoryData[];
    recent_transactions: RecentTransaction[];
    budget_overview: BudgetOverview[];
  }> {
    const response = await fetch(`${API_BASE_URL}/metrics/complete`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const result = await handleResponse<ApiResponse<any>>(response);
    return result.data;
  },

  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  }
};

export default dashboardApi;
