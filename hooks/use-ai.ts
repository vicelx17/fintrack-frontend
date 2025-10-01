import { AIInsightsService } from '@/services/ai-insights';
import { useEffect, useState } from 'react';

interface AIInsight {
    type: "prediction" | "warning" | "tip";
    title: string;
    message: string;
    confidence: "Alta" | "Media" | "Crítico";
    icon: string;
    color: string;
    amount?: number;
    category?: string;
}

interface SpendingTrend {
    trend: "increasing" | "decreasing" | "stable" | "neutral";
    message: string;
    percentage: number;
}

interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

interface PredictionData {
    type: "spending" | "income" | "balance" | "savings";
    current: number;
    predicted: number;
    confidence: number;
    timeframe: string;
    factors: string[];
}

interface SmartRecommendation {
    id: string;
    type: "savings" | "budget" | "alert" | "goal";
    title: string;
    description: string;
    impact: "Alto" | "Medio" | "Bajo";
    effort: "Muy Bajo" | "Bajo" | "Medio" | "Alto";
    potentialSavings: number;
    confidence: number;
    category?: string;
    actionable: boolean;
}

interface RiskAnalysis {
    overallScore: number;
    level: "Muy Bajo" | "Bajo" | "Medio" | "Alto" | "Muy Alto";
    factors: {
        incomeVolatility: number;
        expenseConcentration: number;
        budgetCompliance: number;
        emergencyFund: number;
    };
    recommendations: string[];
}

interface FinancialForecast {
    timeframe: "3months" | "6months" | "1year";
    scenarios: {
        optimistic: { balance: number; probability: number };
        realistic: { balance: number; probability: number };
        conservative: { balance: number; probability: number };
    };
    keyFactors: string[];
    confidence: number;
}

export function useAIInsights() {
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [loading, setLoading] = useState<LoadingState>({ isLoading: false, error: null });

    const loadInsights = async () => {
        setLoading({ isLoading: true, error: null });
        try {
            const data = await AIInsightsService.getAIInsights();
            
            if (data && data.insights && Array.isArray(data.insights)) {
                setInsights(data.insights);
            } else {
                setInsights([]);
            }
            
            setLoading({ isLoading: false, error: null });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setLoading({ isLoading: false, error: errorMessage });
            
            // SOLO en caso de error, mostrar el fallback
            setInsights([
                {
                    type: "tip",
                    title: "Servicio temporalmente no disponible",
                    message: "El servicio de IA no está disponible en este momento. Por favor, inténtalo de nuevo más tarde.",
                    confidence: "Crítico",
                    icon: "alert-triangle",
                    color: "destructive",
                }
            ]);
        }
    };

    const refresh = () => {
        loadInsights();
    };

    useEffect(() => {
        loadInsights();
    }, []);

    return {
        insights,
        isLoading: loading.isLoading,
        error: loading.error,
        refresh,
    };
}

export function useAIPredictions() {
    const [predictions, setPredictions] = useState<any[]>([]);
    const [loading, setLoading] = useState<LoadingState>({ isLoading: false, error: null });

    const loadPredictions = async () => {
        setLoading({ isLoading: true, error: null });
        try {
            const data = await AIInsightsService.getAIPredictions();

            if (data && data.predictions) {
                setPredictions(data.predictions);
            } else {
                setPredictions([]);
            }
            
            setLoading({ isLoading: false, error: null });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setLoading({ isLoading: false, error: errorMessage });
            setPredictions([]);
        }
    };

    const refresh = () => {
        loadPredictions();
    };

    useEffect(() => {
        loadPredictions();
    }, []);

    return {
        predictions,
        isLoading: loading.isLoading,
        error: loading.error,
        refresh,
    };
}

export function useSpendingTrends() {
    const [trend, setTrend] = useState<SpendingTrend | null>(null);
    const [loading, setLoading] = useState<LoadingState>({ isLoading: false, error: null });

    const loadTrends = async () => {
        setLoading({ isLoading: true, error: null });
        try {
            const data = await AIInsightsService.getSpendingTrends();
            setTrend(data);
            setLoading({ isLoading: false, error: null });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setLoading({ isLoading: false, error: errorMessage });
            setTrend({
                trend: "neutral",
                message: "No hay suficientes datos.",
                percentage: 0
            });
        }
    };

    const refresh = () => {
        loadTrends();
    };

    useEffect(() => {
        loadTrends();
    }, []);

    return {
        trend,
        isLoading: loading.isLoading,
        error: loading.error,
        refresh,
    };
}

export function useSpendingPredictions(timeframe: string = "1month") {
    const [predictions, setPredictions] = useState<PredictionData[]>([]);
    const [loading, setLoading] = useState<LoadingState>({ isLoading: false, error: null });

    const loadPredictions = async () => {
        setLoading({ isLoading: true, error: null });
        try {
            const data = await AIInsightsService.getSpendingPredictions(timeframe);
            setPredictions(data);
            setLoading({ isLoading: false, error: null });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setLoading({ isLoading: false, error: errorMessage });
            setPredictions([]);
        }
    };

    const refresh = () => {
        loadPredictions();
    };

    useEffect(() => {
        loadPredictions();
    }, [timeframe]);

    return {
        predictions,
        isLoading: loading.isLoading,
        error: loading.error,
        refresh,
    };
}

export function useBalanceForecast(timeframe: string = "6months") {
    const [forecast, setForecast] = useState<FinancialForecast | null>(null);
    const [loading, setLoading] = useState<LoadingState>({ isLoading: false, error: null });

    const loadForecast = async () => {
        setLoading({ isLoading: true, error: null });
        try {
            const data = await AIInsightsService.getBalanceForecast(timeframe);
            setForecast(data);
            setLoading({ isLoading: false, error: null });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setLoading({ isLoading: false, error: errorMessage });
            setForecast(null);
        }
    };

    const refresh = () => {
        loadForecast();
    };

    useEffect(() => {
        loadForecast();
    }, [timeframe]);

    return {
        forecast,
        isLoading: loading.isLoading,
        error: loading.error,
        refresh,
    };
}

export function useSmartRecommendations() {
    const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
    const [loading, setLoading] = useState<LoadingState>({ isLoading: false, error: null });

    const loadRecommendations = async () => {
        setLoading({ isLoading: true, error: null });
        try {
            const data = await AIInsightsService.getSmartRecommendations();
            setRecommendations(data);
            setLoading({ isLoading: false, error: null });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setLoading({ isLoading: false, error: errorMessage });
            setRecommendations([]);
        }
    };

    const refresh = () => {
        loadRecommendations();
    };

    useEffect(() => {
        loadRecommendations();
    }, []);

    return {
        recommendations,
        isLoading: loading.isLoading,
        error: loading.error,
        refresh,
    };
}

export function useRiskAnalysis() {
    const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
    const [loading, setLoading] = useState<LoadingState>({ isLoading: false, error: null });

    const loadAnalysis = async () => {
        setLoading({ isLoading: true, error: null });
        try {
            const data = await AIInsightsService.getRiskAnalysis();
            setAnalysis(data);
            setLoading({ isLoading: false, error: null });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setLoading({ isLoading: false, error: errorMessage });
            setAnalysis(null);
        }
    };

    const refresh = () => {
        loadAnalysis();
    };

    useEffect(() => {
        loadAnalysis();
    }, []);

    return {
        analysis,
        isLoading: loading.isLoading,
        error: loading.error,
        refresh,
    };
}