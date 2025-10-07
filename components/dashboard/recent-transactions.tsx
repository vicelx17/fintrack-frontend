import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRecentTransactions } from "@/hooks/use-dashboard"
import { BriefcaseBusiness, BusFront, ChefHat, Coffee, MoreHorizontal, PlaneTakeoff, ReceiptEuro, ShoppingCart, Wallet } from "lucide-react"

// Mapeo de categorías a iconos
const categoryIcons: { [key: string]: any } = {
  "Alimentación": ChefHat,
  "Facturas": ReceiptEuro,
  "Suscripciones": Wallet,
  "Transporte": BusFront,
  "Viajes": PlaneTakeoff,
  "Ocio": Coffee,
  "Trabajo": BriefcaseBusiness,
  "Otros": ShoppingCart
}

const getCategoryIcon = (category: string) => {
  return categoryIcons[category] || ReceiptEuro 
}

export function RecentTransactions() {
  const { data: recentTransactions, isLoading, error, reload } = useRecentTransactions(10)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>Últimos movimientos en tus cuentas</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gray-200 w-10 h-10"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Error: {error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={reload}>
              Reintentar
            </Button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay transacciones recientes</p>
              </div>
            ) : (
              recentTransactions.map((transaction) => {
                const Icon = getCategoryIcon(transaction.category)
                const isIncome = transaction.type === "income"
                const isExpense = transaction.type === "expense"

                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isIncome ? "bg-primary/10" : "bg-secondary/10"}`}>
                        <Icon className={`w-4 h-4 ${isIncome ? "text-primary" : "text-secondary"}`} />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString("es-ES", {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-semibold ${
                          isIncome
                            ? "text-primary"
                            : isExpense
                            ? "text-destructive"
                            : "text-foreground"
                        }`}
                      >
                        {isIncome && "+"}
                        {isExpense && "-"}
                        €{Math.abs(transaction.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </span>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}