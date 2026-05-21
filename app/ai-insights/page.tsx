import { AIInsightsHeader } from "@/components/ai-insights/ai-insights-header"
import { FinancialForecast } from "@/components/ai-insights/financial-forecast"
import { PredictionOverview } from "@/components/ai-insights/prediction-overview"
import { RiskAnalysis } from "@/components/ai-insights/risk-analysis"
import { SavingsGoals } from "@/components/ai-insights/savings-goals"
import { SmartRecommendations } from "@/components/ai-insights/smart-recommendations"
import { SpendingPredictions } from "@/components/ai-insights/spending-predictions"
import { AuthProvider } from "@/components/auth/auth-provider"

export default function AIInsightsPage() {
  return (
    <AuthProvider protected>
      <div className="min-h-screen bg-background">
        <AIInsightsHeader />

        <main className="container mx-auto px-4 py-6 space-y-6">
          <PredictionOverview />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SpendingPredictions />
              <FinancialForecast />
            </div>

            <div className="space-y-6">
              <SmartRecommendations />
              <SavingsGoals />
              <RiskAnalysis />
            </div>
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}