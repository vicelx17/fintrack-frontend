"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useTransactions } from "@/hooks/use-transactions"
import { transactionEvents } from "@/lib/transaction-events"
import { transactionsApi, type TransactionFilters } from "@/services/transactions-api"
import {
  BriefcaseBusiness, BusFront, ChefHat, Coffee,
  Edit,
  MoreHorizontal, PlaneTakeoff, ReceiptEuro, ShoppingCart,
  Trash2,
  Wallet
} from "lucide-react"
import { useEffect, useState } from "react"
import { TransactionDialog } from "./transaction-dialog"

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
  return categoryIcons[category] || ShoppingCart
}

interface TransactionListProps {
  filters?: TransactionFilters
}

export function TransactionList({ filters }: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  
  const { 
    transactionList, 
    loading, 
    loadTransactions,
    refreshTransactions 
  } = useTransactions()

  useEffect(() => {
    loadTransactions(filters)
  }, [filters])

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setIsDialogOpen(true)
  }

  const handleDelete = async (transactionId: string) => {
    try {
      const result = await transactionsApi.deleteTransaction(transactionId)
      
      if (result.success) {
        toast({
          title: "Éxito",
          description: "Transacción eliminada correctamente",
        })
        // Emitir evento de eliminación
        transactionEvents.emit('transaction-deleted')
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo eliminar la transacción",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la transacción",
        variant: "destructive",
      })
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingTransaction(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          {loading.transactions.isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Cargando transacciones...
            </div>
          ) : loading.transactions.error ? (
            <div className="text-center py-8 text-destructive">
              Error: {loading.transactions.error}
            </div>
          ) : transactionList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay transacciones para mostrar
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionList.map((transaction) => {
                  const Icon = getCategoryIcon(transaction.category)
                  const isIncome = transaction.type === "income"
                  const isExpense = transaction.type === "expense"

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {new Date(transaction.transactionDate).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${isIncome ? "bg-primary/10" : isExpense ? "bg-destructive/10" : "bg-muted"}`}>
                            <Icon className={`w-4 h-4 ${isIncome ? "text-primary" : isExpense ? "text-destructive" : "text-foreground"}`} />
                          </div>
                          <span>{transaction.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${
                        isIncome
                          ? "text-primary"
                          : isExpense
                          ? "text-destructive"
                          : "text-foreground"
                      }`}>
                        {isIncome ? "+" : isExpense ? "-" : ""}
                        €{Math.abs(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(transaction.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        transaction={editingTransaction}
        onClose={handleDialogClose}
      />
    </>
  )
}