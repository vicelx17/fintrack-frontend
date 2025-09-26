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

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export class AIInsightsService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("fintrack_token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  // Predictions
  static async getSpendingPredictions(timeframe = "1month"): Promise<PredictionData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/predictions/spending?timeframe=${timeframe}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.predictions || []
      }
    } catch (error) {
      console.error("Error fetching spending predictions:", error)
    }

    return []
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
    } catch (error) {
      console.error("Error fetching balance forecast:", error)
    }

    return null
  }

  // Recommendations
  static async getSmartRecommendations(): Promise<SmartRecommendation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/recommendations`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.recommendations || []
      }
    } catch (error) {
      console.error("Error fetching smart recommendations:", error)
    }

    return []
  }

  static async applyRecommendation(recommendationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/recommendations/${recommendationId}/apply`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })

      return response.ok
    } catch (error) {
      console.error("Error applying recommendation:", error)
    }

    return false
  }

  // Savings Goals
  static async getSavingsGoalPredictions(): Promise<SavingsGoalPrediction[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/savings-goals/predictions`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.predictions || []
      }
    } catch (error) {
      console.error("Error fetching savings goal predictions:", error)
    }

    return []
  }

  // Risk Analysis
  static async getRiskAnalysis(): Promise<RiskAnalysis | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/risk-analysis`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.analysis
      }
    } catch (error) {
      console.error("Error fetching risk analysis:", error)
    }

    return null
  }

  // AI Model Management
  static async refreshAIAnalysis(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/refresh`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })

      return response.ok
    } catch (error) {
      console.error("Error refreshing AI analysis:", error)
    }

    return false
  }

  static async getAIModelStatus(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/status`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.status
      }
    } catch (error) {
      console.error("Error fetching AI model status:", error)
    }

    return null
  }

  static async updateAIPreferences(preferences: any): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/preferences`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(preferences),
      })

      return response.ok
    } catch (error) {
      console.error("Error updating AI preferences:", error)
    }

    return false
  }
}
