import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ShoppingCart, Car, Home, Coffee, MoreHorizontal } from "lucide-react"

const recentTransactions = [
  {
    id: "1",
    description: "Supermercado Central",
    category: "Alimentación",
    amount: -85.5,
    date: "2025-01-15",
    type: "expense",
    icon: ShoppingCart,
  },
  {
    id: "2",
    description: "Salario Enero",
    category: "Ingresos",
    amount: 4200.0,
    date: "2025-01-01",
    type: "income",
    icon: ArrowUpRight,
  },
  {
    id: "3",
    description: "Gasolina Shell",
    category: "Transporte",
    amount: -65.2,
    date: "2025-01-14",
    type: "expense",
    icon: Car,
  },
  {
    id: "4",
    description: "Alquiler Apartamento",
    category: "Vivienda",
    amount: -1200.0,
    date: "2025-01-01",
    type: "expense",
    icon: Home,
  },
  {
    id: "5",
    description: "Café Central",
    category: "Entretenimiento",
    amount: -12.5,
    date: "2025-01-13",
    type: "expense",
    icon: Coffee,
  },
]

export function RecentTransactions() {
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
        <div className="space-y-4">
          {recentTransactions.map((transaction) => {
            const Icon = transaction.icon
            const isIncome = transaction.type === "income"

            return (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
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
                        {new Date(transaction.date).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${isIncome ? "text-primary" : "text-foreground"}`}>
                    {isIncome ? "+" : ""}€{Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
