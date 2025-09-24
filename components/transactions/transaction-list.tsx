"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  ShoppingCart,
  Car,
  Home,
  Coffee,
  ArrowUpRight,
  Smartphone,
  Heart,
  GraduationCap,
} from "lucide-react"
import { TransactionDialog } from "./transaction-dialog"

const mockTransactions = [
  {
    id: "1",
    date: "2025-01-15",
    description: "Supermercado Central",
    category: "Alimentación",
    amount: -85.5,
    type: "expense",
    account: "Cuenta Corriente",
    icon: ShoppingCart,
  },
  {
    id: "2",
    date: "2025-01-01",
    description: "Salario Enero",
    category: "Ingresos",
    amount: 4200.0,
    type: "income",
    account: "Cuenta Corriente",
    icon: ArrowUpRight,
  },
  {
    id: "3",
    date: "2025-01-14",
    description: "Gasolina Shell",
    category: "Transporte",
    amount: -65.2,
    type: "expense",
    account: "Tarjeta de Crédito",
    icon: Car,
  },
  {
    id: "4",
    date: "2025-01-01",
    description: "Alquiler Apartamento",
    category: "Vivienda",
    amount: -1200.0,
    type: "expense",
    account: "Cuenta Corriente",
    icon: Home,
  },
  {
    id: "5",
    date: "2025-01-13",
    description: "Café Central",
    category: "Entretenimiento",
    amount: -12.5,
    type: "expense",
    account: "Tarjeta de Débito",
    icon: Coffee,
  },
  {
    id: "6",
    date: "2025-01-12",
    description: "Factura Móvil",
    category: "Servicios",
    amount: -45.0,
    type: "expense",
    account: "Cuenta Corriente",
    icon: Smartphone,
  },
  {
    id: "7",
    date: "2025-01-10",
    description: "Consulta Médica",
    category: "Salud",
    amount: -80.0,
    type: "expense",
    account: "Cuenta Corriente",
    icon: Heart,
  },
  {
    id: "8",
    date: "2025-01-08",
    description: "Curso Online",
    category: "Educación",
    amount: -150.0,
    type: "expense",
    account: "Tarjeta de Crédito",
    icon: GraduationCap,
  },
]

export function TransactionList() {
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
              {mockTransactions.map((transaction) => {
                const Icon = transaction.icon
                const isIncome = transaction.type === "income"

                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString("es-ES")}
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
