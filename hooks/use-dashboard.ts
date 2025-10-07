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
    }>({
        financial: { isLoading: false, error: null },
        monthly: { isLoading: false, error: null },
        category: { isLoading: false, error: null },
        recent: { isLoading: false, error: null },
        budget: { isLoading: false, error: null },
    });

    const setLoading = (key: keyof typeof loadingStates, isLoading: boolean, error: string | null = null) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: { isLoading, error }
        }));
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

    const refreshAll = async () => {
        await Promise.all([
            loadFinancialSummary(),
            loadMonthlyData(),
            loadCategoryData(),
            loadRecentTransactions(),
            loadBudgetOverview()
        ]);
    };


    return {
        financialSummary,
        monthlyData,
        categoryData,
        recentTransactions,
        budgetOverview,
        
        loading: loadingStates,

        loadFinancialSummary,
        loadMonthlyData,
        loadCategoryData,
        loadRecentTransactions,
        loadBudgetOverview,
        refreshAll,

        isAnyLoading: Object.values(loadingStates).some(state => state.isLoading),
        hasAnyError: Object.values(loadingStates).some(state => state.error !== null),
        allErrors: Object.values(loadingStates).map(state => state.error).filter(error => error !== null),
    };
}

import { transactionEvents } from '@/lib/transaction-events'; // Añade este import

// Dentro de cada hook personalizado, añade la suscripción:

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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
        
        const unsubscribeCreated = transactionEvents.subscribe('transaction-created', load);
        const unsubscribeUpdated = transactionEvents.subscribe('transaction-updated', load);
        const unsubscribeDeleted = transactionEvents.subscribe('transaction-deleted', load);

        return () => {
            unsubscribeCreated();
            unsubscribeUpdated();
            unsubscribeDeleted();
        };
    }, []);

    return { data, isLoading, error, reload: load };
}

export function useMonthlyData(months: number = 6){
    const [data, setData] = useState<MonthlyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setIsLoading(true);
        try {
            const result = await dashboardApi.getMonthlyData(months);
            setData(result);
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
        
        const unsubscribeCreated = transactionEvents.subscribe('transaction-created', load);
        const unsubscribeUpdated = transactionEvents.subscribe('transaction-updated', load);
        const unsubscribeDeleted = transactionEvents.subscribe('transaction-deleted', load);

        return () => {
            unsubscribeCreated();
            unsubscribeUpdated();
            unsubscribeDeleted();
        };
    }, [months]);

    return { data, isLoading, error, reload: load };
}

export function useCategoryData(){
    const [data, setData] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setIsLoading(true);
        try {
            const result = await dashboardApi.getCategoryData();
            setData(result);
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
        
        const unsubscribeCreated = transactionEvents.subscribe('transaction-created', load);
        const unsubscribeUpdated = transactionEvents.subscribe('transaction-updated', load);
        const unsubscribeDeleted = transactionEvents.subscribe('transaction-deleted', load);

        return () => {
            unsubscribeCreated();
            unsubscribeUpdated();
            unsubscribeDeleted();
        };
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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
        
        const unsubscribeCreated = transactionEvents.subscribe('transaction-created', load);
        const unsubscribeUpdated = transactionEvents.subscribe('transaction-updated', load);
        const unsubscribeDeleted = transactionEvents.subscribe('transaction-deleted', load);

        return () => {
            unsubscribeCreated();
            unsubscribeUpdated();
            unsubscribeDeleted();
        };
    }, [limit]);

    return { data, isLoading, error, reload: load };
}

export function useBudgetOverview(){
    const [data, setData] = useState<BudgetOverview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setIsLoading(true);
        try {
            const result = await dashboardApi.getBudgetOverview();
            setData(result);
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return { data, isLoading, error, reload: load };
}