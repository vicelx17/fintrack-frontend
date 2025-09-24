import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, Calendar, TrendingUp } from "lucide-react"

const savingsGoals = [
  {
    id: "1",
    title: "Fondo de Emergencia",
    target: 10000,
    current: 8750,
    deadline: "2025-06-30",
    aiPrediction: {
      likelihood: 92,
      projectedCompletion: "2025-05-15",
      monthlyRequired: 208,
    },
  },
  {
    id: "2",
    title: "Vacaciones de Verano",
    target: 3000,
    current: 1200,
    deadline: "2025-07-01",
    aiPrediction: {
      likelihood: 78,
      projectedCompletion: "2025-07-20",
      monthlyRequired: 300,
    },
  },
  {
    id: "3",
    title: "Nuevo Portátil",
    target: 1500,
    current: 450,
    deadline: "2025-04-01",
    aiPrediction: {
      likelihood: 65,
      projectedCompletion: "2025-05-10",
      monthlyRequired: 350,
    },
  },
]

export function SavingsGoals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-primary" />
          <span>Metas de Ahorro IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {savingsGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100
            const remaining = goal.target - goal.current
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
            )

            const getLikelihoodColor = (likelihood: number) => {
              if (likelihood >= 80) return "bg-primary text-primary-foreground"
              if (likelihood >= 60) return "bg-secondary text-secondary-foreground"
              return "bg-destructive text-destructive-foreground"
            }

            const getLikelihoodText = (likelihood: number) => {
              if (likelihood >= 80) return "Muy Probable"
              if (likelihood >= 60) return "Probable"
              return "Difícil"
            }

            return (
              <div key={goal.id} className="space-y-4 p-4 rounded-lg border bg-card/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{goal.title}</h3>
                  <Badge className={getLikelihoodColor(goal.aiPrediction.likelihood)}>
                    {getLikelihoodText(goal.aiPrediction.likelihood)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>€{goal.current.toLocaleString()}</span>
                    <span>€{goal.target.toLocaleString()}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress.toFixed(1)}% completado</span>
                    <span>€{remaining.toLocaleString()} restante</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Fecha límite:</span>
                    </div>
                    <span>{new Date(goal.deadline).toLocaleDateString("es-ES")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Predicción IA:</span>
                    </div>
                    <span>{new Date(goal.aiPrediction.projectedCompletion).toLocaleDateString("es-ES")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ahorro requerido:</span>
                    <span className="font-medium">€{goal.aiPrediction.monthlyRequired}/mes</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
