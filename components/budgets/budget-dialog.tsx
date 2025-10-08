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
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface BudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget?: any
  onClose?: () => void
}

export function BudgetDialog({ open, onOpenChange, budget, onClose }: BudgetDialogProps) {
  const [formData, setFormData] = useState({
    category: "",
    budgetAmount: "",
    period: "monthly",
    startDate: new Date(),
    endDate: new Date(),
    alertThreshold: "80",
  })

  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    "Alimentación",
    "Transporte",
    "Entretenimiento",
    "Servicios",
    "Compras",
    "Salud",
    "Educación",
    "Vivienda",
    "Otros",
  ]

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        budgetAmount: budget.budgetAmount.toString(),
        period: budget.period,
        startDate: new Date(budget.startDate),
        endDate: new Date(budget.endDate),
        alertThreshold: budget.alertThreshold?.toString() || "80",
      })
    } else {
      const now = new Date()
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      setFormData({
        category: "",
        budgetAmount: "",
        period: "monthly",
        startDate: now,
        endDate: endOfMonth,
        alertThreshold: "80",
      })
    }
  }, [budget])

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
          {/* Category and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    onSelect={(date) => handleInputChange("startDate", date)}
                    initialFocus
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
                    onSelect={(date) => handleInputChange("endDate", date)}
                    initialFocus
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : budget ? "Actualizar" : "Crear Presupuesto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
