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
import { budgetEvents } from "@/lib/budget-events"
import { budgetApi } from "@/services/budgets-api"
import { categoriesApi } from "@/services/categories-api"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Category {
  id: number
  name: string
  user_id: number
}

interface BudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget?: any
  onClose?: () => void
}

export function BudgetDialog({ open, onOpenChange, budget, onClose }: BudgetDialogProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    budgetAmount: "",
    period: "monthly",
    startDate: new Date(),
    endDate: new Date(),
    alertThreshold: "80",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open])

  useEffect(() => {
    if (budget) {
      setFormData({
        name: budget.name || "",
        category_id: budget.category_id?.toString() || "",
        budgetAmount: budget.budgetAmount?.toString() || "",
        period: budget.period || "monthly",
        startDate: budget.startDate ? new Date(budget.startDate) : new Date(),
        endDate: budget.endDate ? new Date(budget.endDate) : new Date(),
        alertThreshold: budget.alertThreshold?.toString() || "80",
      })
    } else {
      const now = new Date()
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      setFormData({
        name: "",
        category_id: "",
        budgetAmount: "",
        period: "monthly",
        startDate: now,
        endDate: endOfMonth,
        alertThreshold: "80",
      })
    }
  }, [budget, open])

  const loadCategories = async () => {
    try {
      setLoadingCategories(true)
      const data = await categoriesApi.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
      setError("Error al cargar las categorías")
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const selectedCategory = categories.find(c => c.id.toString() === formData.category_id)

      const budgetData = {
        name: formData.name || selectedCategory?.name || "Presupuesto",
        category: selectedCategory?.name || "",
        budgetAmount: parseFloat(formData.budgetAmount),
        period: formData.period,
        startDate: format(formData.startDate, "yyyy-MM-dd"),
        endDate: format(formData.endDate, "yyyy-MM-dd"),
        alertThreshold: parseInt(formData.alertThreshold),
        category_id: parseInt(formData.category_id),
      }

      if (budget) {
        await budgetApi.updateBudget(budget.id, budgetData)
        budgetEvents.emit('budget-updated')
      } else {
        await budgetApi.createBudget(budgetData)
        budgetEvents.emit('budget-created')
      }

      onOpenChange(false)
      if (onClose) onClose()
    } catch (error) {
      console.error("Error saving budget:", error)
      setError(error instanceof Error ? error.message : "Error al guardar el presupuesto")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePeriodChange = (period: string) => {
    const now = new Date()
    let endDate = new Date()

    switch (period) {
      case "weekly":
        endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      case "monthly":
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case "quarterly":
        endDate = new Date(now.getFullYear(), now.getMonth() + 3, 0)
        break
      case "yearly":
        endDate = new Date(now.getFullYear() + 1, 0, 0)
        break
    }

    setFormData((prev) => ({ ...prev, period, endDate }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{budget ? "Editar Presupuesto" : "Nuevo Presupuesto"}</DialogTitle>
          <DialogDescription>
            {budget ? "Modifica los detalles del presupuesto" : "Crea un nuevo presupuesto para controlar tus gastos"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}


          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nombre del presupuesto"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          {/* Category and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              {loadingCategories ? (
                <div className="flex items-center justify-center h-10 border rounded">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleInputChange("category_id", value)}
                  disabled={categories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={categories.length === 0 ? "No hay categorías" : "Seleccionar categoría"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {categories.length === 0 && !loadingCategories && (
                <p className="text-xs text-muted-foreground">
                  Crea una categoría primero en el gestor de categorías
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Cantidad *</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">€</span>
                <Input
                  id="budgetAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.budgetAmount}
                  onChange={(e) => handleInputChange("budgetAmount", e.target.value)}
                  className="pl-8"
                  required
                />
              </div>
            </div>
          </div>

          {/* Period */}
          <div className="space-y-2">
            <Label htmlFor="period">Período *</Label>
            <Select value={formData.period} onValueChange={handlePeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Inicio *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && handleInputChange("startDate", date)}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de Fin *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && handleInputChange("endDate", date)}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Alert Threshold */}
          <div className="space-y-2">
            <Label htmlFor="alertThreshold">Umbral de Alerta (%)</Label>
            <Select
              value={formData.alertThreshold}
              onValueChange={(value) => handleInputChange("alertThreshold", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar umbral" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50% - Alerta temprana</SelectItem>
                <SelectItem value="70">70% - Alerta moderada</SelectItem>
                <SelectItem value="80">80% - Alerta estándar</SelectItem>
                <SelectItem value="90">90% - Alerta tardía</SelectItem>
                <SelectItem value="100">100% - Solo al exceder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || categories.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                budget ? "Actualizar" : "Crear Presupuesto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}