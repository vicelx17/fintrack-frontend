import { useEffect, useState } from "react"
import transactionsApi, { Transaction } from "../services/transactions-api"

interface LoadingState {
    isLoading: boolean
    error: string | null
}

export function useTransactions() {
    const [transactionList, setTransactionList] = useState<Transaction[]>([])

    const [loadingStates, setLoadingStates] = useState<{
        transactions: LoadingState;
    }>({
        transactions: { isLoading: false, error: null },
    });

    const setLoading = (key: keyof typeof loadingStates, isLoading: boolean, error: string | null = null) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: { isLoading, error }
        }));
    };

    const loadTransactions = async () => {
        setLoading('transactions', true);
        try {
            console.log('🚀 Cargando transacciones...');
            const data = await transactionsApi.getTransactions();
            setTransactionList(data);
            setLoading('transactions', false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setLoading('transactions', false, errorMessage);
        }
    };

    const refreshTransactionList = () => {
        loadTransactions();
};

useEffect(() => {
    loadTransactions();
}, []);

    return {
        transactionList,

        loading: loadingStates,

        loadTransactions,

        isAnyLoading: Object.values(loadingStates).some(state => state.isLoading),
        hasAnyError: Object.values(loadingStates).some(state => state.error !== null),
        allErrors: Object.values(loadingStates).map(state => state.error).filter(error => error !== null),
    }
}