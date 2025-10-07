import { useCallback, useEffect, useState } from "react"
import transactionsApi, {
    CategoryBreakdown,
    Transaction,
    TransactionFilters,
    TransactionStats
} from "../services/transactions-api"

interface LoadingState {
    isLoading: boolean
    error: string | null
}

export function useTransactions(filters?: TransactionFilters) {
    const [transactionList, setTransactionList] = useState<Transaction[]>([])
    const [transactionStats, setTransactionStats] = useState<TransactionStats | null>(null)
    const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([])

    const [loadingStates, setLoadingStates] = useState<{
        transactions: LoadingState
        stats: LoadingState
        breakdown: LoadingState
    }>({
        transactions: { isLoading: false, error: null },
        stats: { isLoading: false, error: null },
        breakdown: { isLoading: false, error: null },
    })

    const setLoading = useCallback((
        key: keyof typeof loadingStates,
        isLoading: boolean,
        error: string | null = null
    ) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: { isLoading, error }
        }))
    }, [])

    const loadTransactions = useCallback(async (appliedFilters?: TransactionFilters) => {
        setLoading('transactions', true)
        try {
            const data = await transactionsApi.getTransactions(appliedFilters)
            setTransactionList(data)
            setLoading('transactions', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            setLoading('transactions', false, errorMessage)
        }
    }, [setLoading])

    const loadTransactionStats = useCallback(async (dateRange?: string) => {
        setLoading('stats', true)
        try {
            const data = await transactionsApi.getTransactionStats(dateRange)
            setTransactionStats(data)
            setLoading('stats', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando estadísticas'
            setLoading('stats', false, errorMessage)
        }
    }, [setLoading])

    const loadCategoryBreakdown = useCallback(async (dateRange?: string) => {
        setLoading('breakdown', true)
        try {
            const data = await transactionsApi.getCategoryBreakdown(dateRange)
            console.log('Breakdown data received:', data) // 👈 Agregar esto
            console.log('Is array?', Array.isArray(data)) // 👈 Y esto
            setCategoryBreakdown(data)
            setLoading('breakdown', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando desglose por categoría'
            setLoading('breakdown', false, errorMessage)
        }
    }, [setLoading])

    const refreshTransactions = useCallback((appliedFilters?: TransactionFilters) => {
        loadTransactions(appliedFilters)
    }, [loadTransactions])

    const refreshStats = useCallback((dateRange?: string) => {
        loadTransactionStats(dateRange)
    }, [loadTransactionStats])

    const refreshBreakdown = useCallback((dateRange?: string) => {
        loadCategoryBreakdown(dateRange)
    }, [loadCategoryBreakdown])

    useEffect(() => {
        if (filters) {
            loadTransactions(filters)
        }
    }, []) 

    return {
        transactionList,
        transactionStats,
        categoryBreakdown,

        loading: loadingStates,

        loadTransactions,
        loadTransactionStats,
        loadCategoryBreakdown,

        refreshTransactions,
        refreshStats,
        refreshBreakdown,

        isAnyLoading: Object.values(loadingStates).some(state => state.isLoading),
        hasAnyError: Object.values(loadingStates).some(state => state.error !== null),
        allErrors: Object.values(loadingStates).map(state => state.error).filter(error => error !== null),
    }
}