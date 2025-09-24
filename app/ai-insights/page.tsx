import { AIInsightsHeader } from "@/components/ai-insights/ai-insights-header"
import { PredictionOverview } from "@/components/ai-insights/prediction-overview"
import { SpendingPredictions } from "@/components/ai-insights/spending-predictions"
import { SavingsGoals } from "@/components/ai-insights/savings-goals"
import { SmartRecommendations } from "@/components/ai-insights/smart-recommendations"
import { FinancialForecast } from "@/components/ai-insights/financial-forecast"
import { RiskAnalysis } from "@/components/ai-insights/risk-analysis"

export default function AIInsightsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AIInsightsHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Prediction Overview */}
        <PredictionOverview />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <SpendingPredictions />
            <FinancialForecast />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SmartRecommendations />
            <SavingsGoals />
            <RiskAnalysis />
          </div>
        </div>
      </main>
    </div>
  )
}
