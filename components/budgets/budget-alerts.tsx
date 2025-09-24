"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, X } from "lucide-react"

const mockAlerts = [
  {
    id: "1",
    type: "warning",
    category: "Entretenimiento",
    message: "Has excedido el presupuesto en €20.00",
    severity: "high",
  },
  {
    id: "2",
    type: "info",
    category: "Servicios",
    message: "Has usado el 97% de tu presupuesto (€680 de €700)",
    severity: "medium",
  },
  {
    id: "3",
    type: "info",
    category: "Alimentación",
    message: "Has usado el 85% de tu presupuesto (€850 de €1000)",
    severity: "low",
  },
]

export function BudgetAlerts() {
  const handleDismissAlert = (alertId: string) => {
    console.log("Dismiss alert:", alertId)
  }

  if (mockAlerts.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <span>Alertas de Presupuesto</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <Alert key={alert.id} className={alert.severity === "high" ? "border-destructive" : "border-secondary"}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  {alert.severity === "high" ? (
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                  ) : (
                    <Clock className="w-4 h-4 text-secondary mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{alert.category}</div>
                    <AlertDescription className="text-sm">{alert.message}</AlertDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 -mt-1"
                  onClick={() => handleDismissAlert(alert.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
