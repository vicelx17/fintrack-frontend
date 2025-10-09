import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRecentTransactions } from "@/hooks/use-dashboard"
import { useToast } from "@/hooks/use-toast"
import { transactionEvents } from "@/lib/transaction-events"
import { transactionsApi } from "@/services/transactions-api"
import { BriefcaseBusiness, BusFront, ChefHat, Coffee, Edit, MoreHorizontal, PlaneTakeoff, ReceiptEuro, ShoppingCart, Trash2, Wallet } from "lucide-react"
import { useState } from "react"

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
  const { toast } = useToast()
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (budget: any) => {
    setEditingTransaction(budget)
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const result = await transactionsApi.deleteTransaction(deleteId)
      if (result.success) {
        toast({
          title: "Éxito",
          description: "Transacción eliminada correctamente",
        })
        transactionEvents.emit('transaction-deleted')
        reload()
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo eliminar la transacción",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la transacción",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingTransaction(null)
  }

  return (
    <>
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
                        <div className={`p-2 rounded-lg ${isIncome
                            ? "bg-primary/10"
                            : isExpense
                              ? "bg-destructive/10"
                              : "bg-muted"
                          }`}>
                          <Icon className={`w-4 h-4 ${isIncome
                              ? "text-primary"
                              : isExpense
                                ? "text-destructive"
                                : "text-foreground"
                            }`} />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className={`text-xs border-2 ${isIncome
                                  ? "border-primary"
                                  : isExpense
                                    ? "border-destructive"
                                    : ""
                                }`}
                            >
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
                          className={`font-semibold ${isIncome
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {/* Implement edit if needed */ }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleteId(transaction.id.toString())} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar transacción?</DialogTitle>
          </DialogHeader>
          <div>
            ¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}