"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash2, Tag } from "lucide-react"

const mockCategories = [
  { id: "1", name: "Alimentación", color: "#2D5A3D", transactionCount: 45 },
  { id: "2", name: "Transporte", color: "#4A7F5C", transactionCount: 23 },
  { id: "3", name: "Entretenimiento", color: "#6B9B7A", transactionCount: 18 },
  { id: "4", name: "Servicios", color: "#8CB798", transactionCount: 12 },
  { id: "5", name: "Compras", color: "#AED3B6", transactionCount: 31 },
  { id: "6", name: "Salud", color: "#D0EFD4", transactionCount: 8 },
  { id: "7", name: "Educación", color: "#2D5A3D", transactionCount: 5 },
  { id: "8", name: "Vivienda", color: "#4A7F5C", transactionCount: 15 },
]

export function CategoryManager() {
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      console.log("Add category:", newCategoryName)
      setNewCategoryName("")
      setIsAddingCategory(false)
    }
  }

  const handleEditCategory = (categoryId: string) => {
    console.log("Edit category:", categoryId)
  }

  const handleDeleteCategory = (categoryId: string) => {
    console.log("Delete category:", categoryId)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-primary" />
          <span>Categorías</span>
        </CardTitle>
        <Button size="sm" onClick={() => setIsAddingCategory(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add New Category */}
          {isAddingCategory && (
            <div className="p-3 rounded-lg border bg-accent/50 space-y-3">
              <Label htmlFor="newCategory">Nueva Categoría</Label>
              <Input
                id="newCategory"
                placeholder="Nombre de la categoría"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleAddCategory}>
                  Agregar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsAddingCategory(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Category List */}
          <div className="space-y-2">
            {mockCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                  <div>
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.transactionCount} transacciones
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditCategory(category.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-destructive"
                      disabled={category.transactionCount > 0}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
