"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: any
  onClose?: () => void
}

export function TransactionDialog({ open, onOpenChange, transaction, onClose }: TransactionDialogProps) {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    category: "",
    account: "",
    date: new Date(),
    notes: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const categories = {
    expense: [
      "Alimentación",
      "Transporte",
      "Entretenimiento",
      "Servicios",
      "Compras",
      "Salud",
      "Educación",
      "Vivienda",
      "Otros",
    ],
    income: ["Salario", "Freelance", "Inversiones", "Bonos", "Otros Ingresos"],
  }
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: Math.abs(transaction.amount).toString(),
        description: transaction.description,
        category: transaction.category,
        account: transaction.account,
        date: new Date(transaction.date),
        notes: transaction.notes || "",
      })
    } else {
      setFormData({
        type: "expense",
        amount: "",
        description: "",
        category: "",
        account: "",
        date: new Date(),
        notes: "",
      })
    }
  }, [transaction])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
      if (onClose) onClose()
    }, 1000)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar Transacción" : "Nueva Transacción"}</DialogTitle>
          <DialogDescription>
            {transaction ? "Modifica los detalles de la transacción" : "Registra un nuevo ingreso o gasto"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <Tabs value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense">Gasto</TabsTrigger>
              <TabsTrigger value="income">Ingreso</TabsTrigger>
            </TabsList>

            <TabsContent value="expense" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Cantidad *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">€</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.expense.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="income" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Cantidad *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">€</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.income.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Description and Account */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Input
                id="description"
                placeholder="Ej: Compra en supermercado"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Fecha *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleInputChange("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Información adicional sobre la transacción..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : transaction ? "Actualizar" : "Crear Transacción"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
