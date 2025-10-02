"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTransactions } from "@/hooks/use-transactions"
import {
  ArrowUpRight, Car, Coffee,
  Copy,
  Edit,
  Home, MoreHorizontal, ShoppingCart,
  Trash2
} from "lucide-react"
import { useState } from "react"
import { TransactionDialog } from "./transaction-dialog"


const categoryIcons: { [key: string]: any } = {
  "Alimentación": ShoppingCart,
  "Transporte": Car,
  "Vivienda": Home,
  "Entretenimiento": Coffee,
  "Ingresos": ArrowUpRight,
}

const getCategoryIcon = (category: string) => {
  return categoryIcons[category] || ShoppingCart
}

export function TransactionList() {
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // CORRECCIÓN: El hook exporta 'loading' no 'loadingStates'
  const { transactionList, loading } = useTransactions()
  
  console.log("TransactionList render", { 
    transactionList, 
    count: transactionList.length,
    loading: loading.transactions 
  })

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setIsDialogOpen(true)
  }

  const handleDelete = (transactionId: string) => {
    console.log("Delete transaction:", transactionId)
  }

  const handleDuplicate = (transaction: any) => {
    console.log("Duplicate transaction:", transaction)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          {/* CORRECCIÓN: Agregar estados de carga y vacío */}
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

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {new Date(transaction.transactionDate).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${isIncome ? "bg-green-100" : "bg-red-100"}`}>
                            <Icon className={`w-4 h-4 ${isIncome ? "text-green-600" : "text-red-600"}`} />
                          </div>
                          <span>{transaction.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${isIncome ? "text-green-600" : "text-red-600"}`}>
                        {isIncome ? "+" : "-"}€{Math.abs(transaction.amount).toFixed(2)}
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
                            <DropdownMenuItem onClick={() => handleDuplicate(transaction)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicar
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
        onClose={() => {
          setEditingTransaction(null)
          setIsDialogOpen(false)
        }}
      />
    </>
  )
}