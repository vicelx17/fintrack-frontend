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
  // Agregar más si tenemos más categorías
}
const getCategoryIcon = (category: string) => {
    // Mapeo de categorías a iconos
    return categoryIcons[category] || ShoppingCart // Icono por defecto
}
export function TransactionList() {
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { transactionList, loading } = useTransactions()

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setIsDialogOpen(true)
  }

  

  const handleDelete = (transactionId: string) => {
    // Handle delete logic
    console.log("Delete transaction:", transactionId)
  }

  const handleDuplicate = (transaction: any) => {
    // Handle duplicate logic
    console.log("Duplicate transaction:", transaction)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Cuenta</TableHead>
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
                      {new Date(transaction.transaction_date).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isIncome ? "bg-primary/10" : "bg-secondary/10"}`}>
                          <Icon className={`w-4 h-4 ${isIncome ? "text-primary" : "text-secondary"}`} />
                        </div>
                        <span>{transaction.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{transaction.account}</TableCell>
                    <TableCell className={`text-right font-semibold ${isIncome ? "text-primary" : "text-foreground"}`}>
                      {isIncome ? "+" : ""}€{Math.abs(transaction.amount).toFixed(2)}
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
