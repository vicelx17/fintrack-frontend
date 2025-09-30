import dashboardApi from "@/services/dashboard-api";
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

export function useAIInsights() {
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [loading, setLoading] = useState<LoadingState>({ isLoading: false, error: null });

    const loadInsights = async () => {
        setLoading({ isLoading: true, error: null });
        try {
            const data = await dashboardApi.getAIInsights();
            setInsights(data.insights);
            setLoading({ isLoading: false, error: null });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setLoading({ isLoading: false, error: errorMessage });
        }

        setInsights([
            {
                type: "tip",
                title: "Servicio temporalmente no disponible",
                message: "El servicio de IA no está disponible en este momento. Por favor, inténtalo de nuevo más tarde.",
                confidence: "Crítico",
                icon: "alert-triangle",
                color: "red",
            }
        ]);
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
            const response = await dashboardApi.getAIPredictions();

            if (response.success && response.prediction?.predictions) {
                setPredictions(response.prediction.predictions);
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
            const data = await dashboardApi.getSpendingTrends();
            setTrend(data);
            setLoading({ isLoading: false, error: null });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setLoading({ isLoading: false, error: errorMessage });
            setTrend({
                trend: "neutral",
                message:"No hay suficientes datos.",
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
 