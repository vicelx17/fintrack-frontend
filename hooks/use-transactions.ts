import { useEffect, useState } from "react"
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
        complete: LoadingState
    }>({
        transactions: { isLoading: false, error: null },
        stats: { isLoading: false, error: null },
        breakdown: { isLoading: false, error: null },
        complete: { isLoading: false, error: null },
    })

    const setLoading = (key: keyof typeof loadingStates, isLoading: boolean, error: string | null = null) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: { isLoading, error }
        }))
    }

    const loadCompleteTransactions = async (appliedFilters?: TransactionFilters) => {
        setLoading('complete', true)
        try {
            console.log('🚀 Cargando transactions completo...', appliedFilters)
            const data = await transactionsApi.getCompleteTransactions(appliedFilters)
            console.log('✅ Datos recibidos del backend:', data) 

            setTransactionList(data.transactions)
            setTransactionStats(data.stats)
            setCategoryBreakdown(data.category_breakdown)

            console.log('✅ Estados actualizados')
            console.log('Transactions:', data.transactions.length)
            console.log('Stats:', data.stats)
            console.log('Breakdown:', data.category_breakdown.length)

            setLoadingStates({
                transactions: { isLoading: false, error: null },
                stats: { isLoading: false, error: null },
                breakdown: { isLoading: false, error: null },
                complete: { isLoading: false, error: null },
            })
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            console.error("Error loading complete transactions:", error)
            setLoading('complete', false, errorMessage)
        }
    }

    const loadTransactions = async (appliedFilters?: TransactionFilters) => {
        setLoading('transactions', true)
        try {
            const data = await transactionsApi.getTransactions(appliedFilters)
            setTransactionList(data)
            setLoading('transactions', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            setLoading('transactions', false, errorMessage)
        }
    }

    const loadTransactionStats = async (dateRange?: string) => {
        setLoading('stats', true)
        try {
            const data = await transactionsApi.getTransactionStats(dateRange)
            setTransactionStats(data)
            setLoading('stats', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando estadísticas'
            setLoading('stats', false, errorMessage)
        }
    }

    const loadCategoryBreakdown = async (dateRange?: string) => {
        setLoading('breakdown', true)
        try {
            const data = await transactionsApi.getCategoryBreakdown(dateRange)
            setCategoryBreakdown(data)
            setLoading('breakdown', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando desglose por categoría'
            setLoading('breakdown', false, errorMessage)
        }
    }

    const refreshAll = (appliedFilters?: TransactionFilters) => {
        loadCompleteTransactions(appliedFilters)
    }

    const refreshTransactions = (appliedFilters?: TransactionFilters) => {
        loadTransactions(appliedFilters)
    }

    const refreshStats = (dateRange?: string) => {
        loadTransactionStats(dateRange)
    }

    const refreshBreakdown = (dateRange?: string) => {
        loadCategoryBreakdown(dateRange)
    }

    useEffect(() => {
        loadCompleteTransactions(filters)
    }, [])

    return {
        transactionList,
        transactionStats,
        categoryBreakdown,
        
        // Loading states
        loading: loadingStates,

        // Load functions
        loadCompleteTransactions,
        loadTransactions,
        loadTransactionStats,
        loadCategoryBreakdown,

        // Refresh functions
        refreshAll,
        refreshTransactions,
        refreshStats,
        refreshBreakdown,

        // Helper states
        isAnyLoading: Object.values(loadingStates).some(state => state.isLoading),
        hasAnyError: Object.values(loadingStates).some(state => state.error !== null),
        allErrors: Object.values(loadingStates).map(state => state.error).filter(error => error !== null),
    }
}