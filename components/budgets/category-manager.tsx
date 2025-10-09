"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { categoriesApi } from "@/services/categories-api"
import { Edit, Loader2, MoreHorizontal, Plus, Tag, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Category {
  id: number
  name: string
  user_id: number
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editCategoryName, setEditCategoryName] = useState("")
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoriesApi.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      await categoriesApi.createCategory({ name: newCategoryName })
      setNewCategoryName("")
      setIsAddingCategory(false)
      loadCategories()
    } catch (error) {
      console.error("Error creating category:", error)
      alert("Error al crear la categoría")
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id)
    setEditCategoryName(category.name)
  }

  const handleSaveEdit = async (categoryId: number) => {
    if (!editCategoryName.trim()) return

    try {
      await categoriesApi.updateCategory(categoryId, { name: editCategoryName })
      setEditingCategoryId(null)
      setEditCategoryName("")
      loadCategories()
    } catch (error) {
      console.error("Error updating category:", error)
      alert("Error al actualizar la categoría")
    }
  }

  const handleCancelEdit = () => {
    setEditingCategoryId(null)
    setEditCategoryName("")
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría? Se eliminarán también todos los presupuestos y transacciones asociadas.")) {
      return
    }

    setDeletingId(categoryId)
    try {
      await categoriesApi.deleteCategory(categoryId)
      loadCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Error al eliminar la categoría")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-primary" />
            <span>Categorías</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Cargando categorías...</span>
          </div>
        </CardContent>
      </Card>
    )
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
                <Button size="sm" variant="outline" onClick={() => {
                  setIsAddingCategory(false)
                  setNewCategoryName("")
                }}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Category List */}
          <div className="space-y-2">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tienes categorías creadas.</p>
                <p className="text-sm mt-2">Crea tu primera categoría para organizar tus presupuestos.</p>
              </div>
            ) : (
              categories.map((category) => {
                const isDeleting = deletingId === category.id
                const isEditing = editingCategoryId === category.id

                return (
                  <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                    {isEditing ? (
                      <div className="flex-1 flex items-center space-x-2">
                        <Input
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSaveEdit(category.id)}
                          className="h-8"
                        />
                        <Button size="sm" onClick={() => handleSaveEdit(category.id)}>
                          Guardar
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-primary" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8" disabled={isDeleting}>
                              {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="w-4 h-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}