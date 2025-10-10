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
import { useToast } from "@/hooks/use-toast"
import { transactionEvents } from "@/lib/transaction-events"
import { categoriesApi, type Category } from "@/services/categories-api"
import { transactionsApi, type TransactionCreate } from "@/services/transactions-api"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: any
  onClose?: () => void
  onSuccess?: () => void
}

export function TransactionDialog({ open, onOpenChange, transaction, onClose, onSuccess }: TransactionDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    description: "",
    categoryId: "",
    date: new Date(),
    notes: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const allCategories = await categoriesApi.getCategories()
        setCategories(allCategories)
      } catch (error) {
        console.error("Error al cargar categorías:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las categorías",
          variant: "destructive",
        })
      } finally {
        setLoadingCategories(false)
      }
    }

    if (open) {
      fetchCategories()
    }
  }, [open, toast])

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: Math.abs(transaction.amount).toString(),
        description: transaction.description,
        categoryId: transaction.categoryId?.toString() || "",
        date: new Date(transaction.transactionDate || transaction.date),
        notes: transaction.notes || "",
      })
    } else {
      setFormData({
        type: "expense",
        amount: "",
        description: "",
        categoryId: "",
        date: new Date(),
        notes: "",
      })
    }
  }, [transaction, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.categoryId) {
        toast({
          title: "Error",
          description: "Por favor selecciona una categoría",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const amount = parseFloat(formData.amount)
      
      if (formData.type === "expense" && amount >= 0) {
        toast({
          title: "Error",
          description: "Los gastos deben ser negativos",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (formData.type === "income" && amount <= 0) {
        toast({
          title: "Error",
          description: "Los ingresos deben ser positivos",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const transactionData: TransactionCreate = {
        type: formData.type,
        amount: amount,
        description: formData.description,
        category_id: parseInt(formData.categoryId),
        transaction_date: format(formData.date, "yyyy-MM-dd"),
        notes: formData.notes || undefined,
      }

      if (transaction) {
        await transactionsApi.updateTransaction(transaction.id, transactionData as any)
        toast({
          title: "Éxito",
          description: "Transacción actualizada correctamente",
        })
        // Emitir evento de actualización
        transactionEvents.emit('transaction-updated')
      } else {
        await transactionsApi.createTransaction(transactionData)
        toast({
          title: "Éxito",
          description: "Transacción creada correctamente",
        })
        // Emitir evento de creación
        transactionEvents.emit('transaction-created')
      }

      onOpenChange(false)
      
      if (onClose) onClose()
      if (onSuccess) onSuccess()

      setFormData({
        type: "expense",
        amount: "",
        description: "",
        categoryId: "",
        date: new Date(),
        notes: "",
      })
    } catch (error) {
      console.error("Error al guardar transacción:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la transacción",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d.]/g, "") // Only allow numbers and dot
    // Prevent multiple dots
    value = value.replace(/^(\d*\.\d{0,2}).*$/, "$1")
    if (formData.type === "expense") {
      handleInputChange("amount", value ? `-${value}` : "")
    } else {
      handleInputChange("amount", value ? `${value}` : "")
    }
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground text-sm">
                      €<span className="ml-0.5">{formData.type === "expense" ? "-" : "+"}</span>
                    </span>
                    <Input
                      id="amount"
                      type="text"
                      inputMode="decimal"
                      placeholder="100.00"
                      value={formData.type === "expense" ? formData.amount.replace("-", "") : formData.amount}
                      onChange={handleAmountInput}
                      className="pl-11"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">El signo negativo es fijo para gastos</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => handleInputChange("categoryId", value)}
                    disabled={loadingCategories}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingCategories ? "Cargando..." : "Seleccionar categoría"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingCategories ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-muted-foreground text-center">
                          No hay categorías disponibles
                        </div>
                      )}
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground text-sm">
                      €<span className="ml-0.5">{formData.type === "expense" ? "-" : "+"}</span>
                    </span>
                    <Input
                      id="amount"
                      type="text"
                      inputMode="decimal"
                      placeholder="100.00"
                      value={formData.type === "expense" ? formData.amount.replace("-", "") : formData.amount}
                      onChange={handleAmountInput}
                      className="pl-11"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">El signo positivo es fijo para ingresos</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => handleInputChange("categoryId", value)}
                    disabled={loadingCategories}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingCategories ? "Cargando..." : "Seleccionar categoría"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingCategories ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-muted-foreground text-center">
                          No hay categorías disponibles
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Description */}
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
                  onSelect={(date) => handleInputChange("date", date || new Date())}
                  autoFocus
                  disabled={(date) => date > new Date()} 
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || loadingCategories}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                transaction ? "Actualizar" : "Crear Transacción"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}