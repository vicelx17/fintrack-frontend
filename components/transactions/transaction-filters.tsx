"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categoriesApi, type Category } from "@/services/categories-api"
import type { TransactionFilters as ITransactionFilters } from "@/services/transactions-api"
import { Search, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

interface TransactionFiltersProps {
  onFiltersChange: (filters: ITransactionFilters) => void
}

export function TransactionFilters({ onFiltersChange }: TransactionFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [categories, setCategories] = useState<Category[]>([])

  // Usar useRef para mantener referencia estable de onFiltersChange
  const onFiltersChangeRef = useRef(onFiltersChange)
  
  useEffect(() => {
    onFiltersChangeRef.current = onFiltersChange
  }, [onFiltersChange])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesApi.getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Error loading categories:", error)
      }
    }
    loadCategories()
  }, [])

  // Aplicar filtros
  useEffect(() => {
    const filters: ITransactionFilters = {}
    
    if (searchTerm) filters.search = searchTerm
    if (selectedCategory !== "all") filters.category = selectedCategory
    if (selectedType !== "all") filters.type = selectedType as "income" | "expense"
    if (dateRange !== "all") filters.dateRange = dateRange

    onFiltersChangeRef.current(filters)
  }, [searchTerm, selectedCategory, selectedType, dateRange])

  const activeFilters = [
    selectedCategory !== "all" && { type: "category", value: selectedCategory, label: selectedCategory },
    selectedType !== "all" && { type: "type", value: selectedType, label: selectedType === "income" ? "Ingresos" : "Gastos" },
    dateRange !== "all" && { type: "date", value: dateRange, label: getDateRangeLabel(dateRange) },
  ].filter(Boolean) as Array<{ type: string; value: string; label: string }>

  function getDateRangeLabel(range: string): string {
    const labels: { [key: string]: string } = {
      today: "Hoy",
      week: "Esta semana",
      month: "Este mes",
      quarter: "Este trimestre",
      year: "Este año",
    }
    return labels[range] || range
  }

  const clearFilter = useCallback((filterType: string) => {
    switch (filterType) {
      case "category":
        setSelectedCategory("all")
        break
      case "type":
        setSelectedType("all")
        break
      case "date":
        setDateRange("all")
        break
    }
  }, [])

  const clearAllFilters = useCallback(() => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedType("all")
    setDateRange("all")
  }, [])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transacciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="income">Ingresos</SelectItem>
                  <SelectItem value="expense">Gastos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo el tiempo</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                  <SelectItem value="quarter">Este trimestre</SelectItem>
                  <SelectItem value="year">Este año</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Filtros activos:</span>
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{filter.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => clearFilter(filter.type)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Limpiar todo
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}