import { useCallback, useEffect, useState } from "react"
import { budgetEvents } from "../lib/budget-events"
import { Budget, BudgetAlert, budgetApi } from "../services/budgets"

interface LoadingState {
    isLoading: boolean
    error: string | null
}

interface BudgetOverview {
    totalBudget: number
    totalSpent: number
    available: number
    percentageUsed: number
    budgetsExceeded: number
    totalBudgets: number
}

interface BudgetAnalytics {
    period: string
    startDate: string
    endDate: string
    overview: BudgetOverview
    categoryBreakdown: any[]
    alerts: BudgetAlert[]
    trends: {
        spendingTrend: string
        savingsRate: number
    }
}

export function useBudgets() {
    const [budgetList, setBudgetList] = useState<Budget[]>([])
    const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([])
    const [budgetOverview, setBudgetOverview] = useState<BudgetOverview | null>(null)
    const [budgetAnalytics, setBudgetAnalytics] = useState<BudgetAnalytics | null>(null)

    const [loadingStates, setLoadingStates] = useState<{
        budgets: LoadingState
        alerts: LoadingState
        overview: LoadingState
        analytics: LoadingState
    }>({
        budgets: { isLoading: false, error: null },
        alerts: { isLoading: false, error: null },
        overview: { isLoading: false, error: null },
        analytics: { isLoading: false, error: null },
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

    const loadBudgets = useCallback(async () => {
        setLoading('budgets', true)
        try {
            const data = await budgetApi.getBudgets()
            setBudgetList(data)
            setLoading('budgets', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando presupuestos'
            setLoading('budgets', false, errorMessage)
        }
    }, [setLoading])

    const loadBudgetAlerts = useCallback(async () => {
        setLoading('alerts', true)
        try {
            const data = await budgetApi.getBudgetAlerts()
            setBudgetAlerts(data)
            setLoading('alerts', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando alertas'
            setLoading('alerts', false, errorMessage)
        }
    }, [setLoading])

    const loadBudgetOverview = useCallback(async () => {
        setLoading('overview', true)
        try {
            const data = await budgetApi.getBudgetOverview()
            setBudgetOverview(data)
            setLoading('overview', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando resumen'
            setLoading('overview', false, errorMessage)
        }
    }, [setLoading])

    const loadBudgetAnalytics = useCallback(async (period: string = "monthly") => {
        setLoading('analytics', true)
        try {
            const data = await budgetApi.getBudgetAnalytics(period)
            setBudgetAnalytics(data)
            setLoading('analytics', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando analytics'
            setLoading('analytics', false, errorMessage)
        }
    }, [setLoading])

    const refreshBudgets = useCallback(() => {
        loadBudgets()
    }, [loadBudgets])

    const refreshAlerts = useCallback(() => {
        loadBudgetAlerts()
    }, [loadBudgetAlerts])

    const refreshOverview = useCallback(() => {
        loadBudgetOverview()
    }, [loadBudgetOverview])

    const refreshAnalytics = useCallback((period?: string) => {
        loadBudgetAnalytics(period)
    }, [loadBudgetAnalytics])

    const refreshAll = useCallback(() => {
        loadBudgets()
        loadBudgetAlerts()
        loadBudgetOverview()
        loadBudgetAnalytics()
    }, [loadBudgets, loadBudgetAlerts, loadBudgetOverview, loadBudgetAnalytics])

    useEffect(() => {
        const unsubscribeCreated = budgetEvents.subscribe('budget-created', refreshAll)
        const unsubscribeUpdated = budgetEvents.subscribe('budget-updated', refreshAll)
        const unsubscribeDeleted = budgetEvents.subscribe('budget-deleted', refreshAll)

        return () => {
            unsubscribeCreated()
            unsubscribeUpdated()
            unsubscribeDeleted()
        }
    }, [refreshAll])

    useEffect(() => {
        loadBudgets()
        loadBudgetAlerts()
        loadBudgetOverview()
    }, [])

    return {
        budgetList,
        budgetAlerts,
        budgetOverview,
        budgetAnalytics,

        loading: loadingStates,

        loadBudgets,
        loadBudgetAlerts,
        loadBudgetOverview,
        loadBudgetAnalytics,

        refreshBudgets,
        refreshAlerts,
        refreshOverview,
        refreshAnalytics,
        refreshAll,

        isAnyLoading: Object.values(loadingStates).some(state => state.isLoading),
        hasAnyError: Object.values(loadingStates).some(state => state.error !== null),
        allErrors: Object.values(loadingStates).map(state => state.error).filter(error => error !== null),
    }
}