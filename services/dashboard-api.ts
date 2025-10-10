
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
    expenses: number;
    incomes: number;
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
    remaining: number;
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
    console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.detail || 'HTPP ${response.status}');
    }
    const data = await response.json();
    return data;
}

export const dashboardApi = {
    // Obetener resumen financiero
    async getFinancialSummary(): Promise<FinancialSummary> {
        const response = await fetch(`${API_BASE_URL}/metrics/financial-summary`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const result = await handleResponse<ApiResponse<FinancialSummary>>(response);
        return result.data;
    },

    // Obtener datos mensuales para gráficos
    async getMonthlyData(months: number = 6): Promise<MonthlyData[]> {
        const response = await fetch(`${API_BASE_URL}/metrics/monthly-data?months=${months}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const result = await handleResponse<ApiResponse<MonthlyData[]>>(response);
        return result.data;
    },

    async getCategoryData(month?: number, year?: number): Promise<CategoryData[]> {
    const params = new URLSearchParams();
    if (month !== undefined) params.append('month', month.toString());
    if (year !== undefined) params.append('year', year.toString());
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/metrics/category-data${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const result = await handleResponse<ApiResponse<CategoryData[]>>(response);
    return result.data;
},

    // Obtener transacciones recientes
    async getRecentTransactions(limit: number = 10): Promise<RecentTransaction[]> {
        const response = await fetch(`${API_BASE_URL}/metrics/recent-transactions?limit=${limit}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const result = await handleResponse<ApiResponse<RecentTransaction[]>>(response);
        return result.data;
    },

    // Obtener resumen de presupuestos
    async getBudgetOverview(): Promise<BudgetOverview[]> {
        const response = await fetch(`${API_BASE_URL}/metrics/budget-overview`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const result = await handleResponse<ApiResponse<BudgetOverview[]>>(response);
        return result.data;
    },

    // Obtener insights de IA
    async getAIInsights(): Promise<{ insights: any[] }> {
        const response = await fetch(`${API_BASE_URL}/ai/ai-insights`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const result = await handleResponse<ApiResponse<{ insights: any[] }>>(response);
        return result.data;
    },

    async getAIPredictions(): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/ai/predict`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return await handleResponse<ApiResponse<any>>(response);
    },

    async getSpendingTrends(): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/ai/spending-trends`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const result = await handleResponse<ApiResponse<any>>(response);
        return result.data;
    },
};

export default dashboardApi;
