import { BudgetOverview, CategoryData, dashboardApi, FinancialSummary, MonthlyData, RecentTransaction } from '@/services/dashboard-api';
import { useEffect, useState } from 'react';

interface LoadingState {
    isLoading: boolean
    error: string | null
}

export function useDashboard(){
    const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null)
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
    const [categoryData, setCategoryData] = useState<CategoryData[]>([])
    const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])
    const [budgetOverview, setBudgetOverview] = useState<BudgetOverview[]>([])


    const [loadingStates, setLoadingStates] = useState<{
        financial: LoadingState;
        monthly: LoadingState;
        category: LoadingState;
        recent: LoadingState;
        budget: LoadingState;
        complete: LoadingState;
    }>({
        financial: { isLoading: false, error: null },
        monthly: { isLoading: false, error: null },
        category: { isLoading: false, error: null },
        recent: { isLoading: false, error: null },
        budget: { isLoading: false, error: null },
        complete: { isLoading: false, error: null },
    });

    const setLoading = (key: keyof typeof loadingStates, isLoading: boolean, error: string | null = null) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: { isLoading, error }
        }));
    };

    const loadCompleteDashboard = async () => {
        setLoading('complete', true);
        try {
            const data = await dashboardApi.getCompleteDashboard();

            setFinancialSummary(data.financial_summary);
            setMonthlyData(data.monthly_chart);
            setCategoryData(data.category_chart);
            setRecentTransactions(data.recent_transactions);
            setBudgetOverview(data.budget_overview);

            setLoadingStates({
                financial: { isLoading: false, error: null },
                monthly: { isLoading: false, error: null },
                category: { isLoading: false, error: null },
                recent: { isLoading: false, error: null },
                budget: { isLoading: false, error: null },
                complete: { isLoading: false, error: null },
            });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error("Error loading complete dashboard:", error);
            setLoading('complete', false, errorMessage);
        }
    };

    const loadFinancialSummary = async () => {
        setLoading('financial', true);
        try {
            const data = await dashboardApi.getFinancialSummary();
            setFinancialSummary(data);
            setLoading('financial', false);
        } catch(error){
            const errorMessage = error instanceof Error ? error.message : 'Error cargando resumen financiero';
            setLoading('financial', false, errorMessage);
        }
    };

    const loadMonthlyData = async () => {
        setLoading('monthly', true);
        try {
            const data = await dashboardApi.getMonthlyData();
            setMonthlyData(data);
            setLoading('monthly', false);
        } catch(error){
            const errorMessage = error instanceof Error ? error.message : 'Error cargando datos mensuales';
            setLoading('monthly', false, errorMessage);
        }
    };

    const loadCategoryData = async () => {
        setLoading('category', true);
        try {
            const data = await dashboardApi.getCategoryData();
            setCategoryData(data);
            setLoading('category', false);
        } catch(error){
            const errorMessage = error instanceof Error ? error.message : 'Error cargando datos por categoría';
            setLoading('category', false, errorMessage);
        }
    };

    const loadRecentTransactions = async () => {
        setLoading('recent', true);
        try {
            const data = await dashboardApi.getRecentTransactions();
            setRecentTransactions(data);
            setLoading('recent', false);
        } catch(error){
            const errorMessage = error instanceof Error ? error.message : 'Error cargando transacciones recientes';
            setLoading('recent', false, errorMessage);
        }
    };

    const loadBudgetOverview = async () => {
        setLoading('budget', true);
        try {
            const data = await dashboardApi.getBudgetOverview();
            setBudgetOverview(data);
            setLoading('budget', false);
        } catch(error){
            const errorMessage = error instanceof Error ? error.message : 'Error cargando presupuestos';
            setLoading('budget', false, errorMessage);
        }
    };

    const refreshAll = () => {
        loadCompleteDashboard();
    }

    const refreshFinancial = () => {
        loadFinancialSummary();
    };

    useEffect(() => {
        loadCompleteDashboard();
    }, []);

    return {
        financialSummary,
        monthlyData,
        categoryData,
        recentTransactions,
        budgetOverview,
        
        loading: loadingStates,

        loadCompleteDashboard,
        loadFinancialSummary,
        loadMonthlyData,
        loadCategoryData,
        loadRecentTransactions,
        loadBudgetOverview,
        refreshAll,
        refreshFinancial,

        isAnyLoading: Object.values(loadingStates).some(state => state.isLoading),
        hasAnyError: Object.values(loadingStates).some(state => state.error !== null),
        allErrors: Object.values(loadingStates).map(state => state.error).filter(error => error !== null),
    };
}

export function useFinancialSummary(){
    const [data, setData] = useState<FinancialSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setIsLoading(true);
        try {
            const result = await dashboardApi.getFinancialSummary();
            setData(result);
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
        }finally{
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return { data, isLoading, error, reload: load };
}

export function useRecentTransactions(limit: number = 10){
    const [data, setData] = useState<RecentTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setIsLoading(true);
        try {
            const result = await dashboardApi.getRecentTransactions(limit);
            setData(result);
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
        }finally{
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [limit]);

    return { data, isLoading, error, reload: load };
}