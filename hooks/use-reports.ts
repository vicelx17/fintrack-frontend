import { CategoryAnalysis, FinancialSummary, ReportData, ReportFilters, reportsApi, TrendData } from "@/services/reports-api"
import { useCallback, useState } from "react"

interface LoadingState {
    isLoading: boolean
    error: string | null
}

export function useReports() {
    const [reportData, setReportData] = useState<ReportData | null>(null)
    const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null)
    const [expenseAnalysis, setExpenseAnalysis] = useState<CategoryAnalysis[]>([])
    const [incomeAnalysis, setIncomeAnalysis] = useState<CategoryAnalysis[]>([])
    const [trendData, setTrendData] = useState<TrendData[]>([])

    const [loadingStates, setLoadingStates] = useState<{
        report: LoadingState
        summary: LoadingState
        expenses: LoadingState
        income: LoadingState
        trends: LoadingState
        export: LoadingState
    }>({
        report: { isLoading: false, error: null },
        summary: { isLoading: false, error: null },
        expenses: { isLoading: false, error: null },
        income: { isLoading: false, error: null },
        trends: { isLoading: false, error: null },
        export: { isLoading: false, error: null },
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

    const generateReport = useCallback(async (filters: ReportFilters) => {
        setLoading('report', true)
        try {
            const data = await reportsApi.generateReport(filters)
            setReportData(data)
            setLoading('report', false)
            return data
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error generando reporte'
            setLoading('report', false, errorMessage)
            return null
        }
    }, [setLoading])

    const loadFinancialSummary = useCallback(async (period: string) => {
        setLoading('summary', true)
        try {
            const data = await reportsApi.getFinancialSummary(period)
            setFinancialSummary(data)
            setLoading('summary', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando resumen financiero'
            setLoading('summary', false, errorMessage)
        }
    }, [setLoading])

    const loadExpenseAnalysis = useCallback(async (period: string) => {
        setLoading('expenses', true)
        try {
            const data = await reportsApi.getExpenseAnalysis(period)
            setExpenseAnalysis(data)
            setLoading('expenses', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando análisis de gastos'
            setLoading('expenses', false, errorMessage)
        }
    }, [setLoading])

    const loadIncomeAnalysis = useCallback(async (period: string) => {
        setLoading('income', true)
        try {
            const data = await reportsApi.getIncomeAnalysis(period)
            setIncomeAnalysis(data)
            setLoading('income', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando análisis de ingresos'
            setLoading('income', false, errorMessage)
        }
    }, [setLoading])

    const loadTrendAnalysis = useCallback(async (period: string, granularity: "daily" | "weekly" | "monthly" = "monthly") => {
        setLoading('trends', true)
        try {
            const data = await reportsApi.getTrendAnalysis(period, granularity)
            setTrendData(data)
            setLoading('trends', false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error cargando análisis de tendencias'
            setLoading('trends', false, errorMessage)
        }
    }, [setLoading])

    const exportReport = useCallback(async (filters: ReportFilters, format: "pdf" | "csv" | "json") => {
        setLoading('export', true)
        try {
            const blob = await reportsApi.exportReport(filters, format)
            if (blob) {
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `report.${format}`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            }
            setLoading('export', false)
            return true
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error exportando reporte'
            setLoading('export', false, errorMessage)
            return false
        }
    }, [setLoading])

    const loadAllReportData = useCallback(async (period: string = "month") => {
        await Promise.all([
            loadFinancialSummary(period),
            loadExpenseAnalysis(period),
            loadIncomeAnalysis(period),
            loadTrendAnalysis(period)
        ])
    }, [loadFinancialSummary, loadExpenseAnalysis, loadIncomeAnalysis, loadTrendAnalysis])

    return {
        reportData,
        financialSummary,
        expenseAnalysis,
        incomeAnalysis,
        trendData,

        loading: loadingStates,

        generateReport,
        loadFinancialSummary,
        loadExpenseAnalysis,
        loadIncomeAnalysis,
        loadTrendAnalysis,
        exportReport,
        loadAllReportData,

        isAnyLoading: Object.values(loadingStates).some(state => state.isLoading),
        hasAnyError: Object.values(loadingStates).some(state => state.error !== null),
        allErrors: Object.values(loadingStates).map(state => state.error).filter(error => error !== null),
    }
}