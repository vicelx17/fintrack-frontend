// AI insights and predictions utilities and API integration
export interface PredictionData {
  type: "spending" | "income" | "balance" | "savings"
  current: number
  predicted: number
  confidence: number
  timeframe: string
  factors: string[]
}

export interface SmartRecommendation {
  id: string
  type: "savings" | "budget" | "alert" | "goal"
  title: string
  description: string
  impact: "Alto" | "Medio" | "Bajo"
  effort: "Muy Bajo" | "Bajo" | "Medio" | "Alto"
  potentialSavings: number
  confidence: number
  category?: string
  actionable: boolean
}

export interface SavingsGoalPrediction {
  goalId: string
  likelihood: number
  projectedCompletion: string
  monthlyRequired: number
  riskFactors: string[]
  recommendations: string[]
}

export interface FinancialForecast {
  timeframe: "3months" | "6months" | "1year"
  scenarios: {
    optimistic: { balance: number; probability: number }
    realistic: { balance: number; probability: number }
    conservative: { balance: number; probability: number }
  }
  keyFactors: string[]
  confidence: number
}

export interface RiskAnalysis {
  overallScore: number
  level: "Muy Bajo" | "Bajo" | "Medio" | "Alto" | "Muy Alto"
  factors: {
    incomeVolatility: number
    expenseConcentration: number
    budgetCompliance: number
    emergencyFund: number
  }
  recommendations: string[]
}

export interface AIInsight {
  type: "prediction" | "warning" | "tip";
  title: string;
  message: string;
  confidence: "Alta" | "Media" | "Crítico";
  icon: string;
  color: string;
  amount?: number;
  category?: string;
}

export interface SpendingTrend {
  trend: "increasing" | "decreasing" | "stable" | "neutral";
  message: string;
  percentage: number;
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export class AIInsightsService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("fintrack_token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  static async getAIInsights(): Promise<{ insights: AIInsight[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/ai-insights`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const result = await response.json()
        return result.data || { insights: [] }
      }

      throw new Error('Error al obtener insights')
    } catch (error) {
      console.error("Error fetching AI insights:", error)
      throw error
    }
  }

  static async getAIPredictions(): Promise<{ predictions: any[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/predict`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          predictions: data.prediction?.predictions || []
        }
      }

      throw new Error('Error al obtener predicciones')
    } catch (error) {
      console.error("Error fetching AI predictions:", error)
      throw error
    }
  }

  static async getSpendingTrends(): Promise<SpendingTrend> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/spending-trends`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const result = await response.json()
        return result.data || { trend: "neutral", message: "Sin datos", percentage: 0 }
      }

      throw new Error('Error al obtener tendencias')
    } catch (error) {
      console.error("Error fetching spending trends:", error)
      throw error
    }
  }
  
  static async getSpendingPredictions(timeframe = "1month"): Promise<PredictionData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/predictions/spending?timeframe=${timeframe}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.predictions || []
      }

      throw new Error('Error al obtener predicciones de gasto')
    } catch (error) {
      console.error("Error fetching spending predictions:", error)
      return []
    }
  }

  static async getBalanceForecast(timeframe = "6months"): Promise<FinancialForecast | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/forecast/balance?timeframe=${timeframe}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.forecast
      }

      throw new Error('Error al obtener pronóstico')
    } catch (error) {
      console.error("Error fetching balance forecast:", error)
      return null
    }
  }
  
  static async getSmartRecommendations(): Promise<SmartRecommendation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/recommendations`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.recommendations || []
      }

      throw new Error('Error al obtener recomendaciones')
    } catch (error) {
      console.error("Error fetching smart recommendations:", error)
      return []
    }
  }
  
  static async getSavingsGoalPredictions(): Promise<SavingsGoalPrediction[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/savings-goals/predictions`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.predictions || []
      }

      throw new Error('Error al obtener predicciones de ahorro')
    } catch (error) {
      console.error("Error fetching savings goal predictions:", error)
      return []
    }
  }
  
  static async getRiskAnalysis(): Promise<RiskAnalysis | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/risk-analysis`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.analysis
      }

      throw new Error('Error al obtener análisis de riesgo')
    } catch (error) {
      console.error("Error fetching risk analysis:", error)
      return null
    }
  }
  
  static async refreshAIAnalysis(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/refresh`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })

      return response.ok
    } catch (error) {
      console.error("Error refreshing AI analysis:", error)
      return false
    }
  }
}