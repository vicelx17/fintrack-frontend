"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { categoriesApi } from "@/services/categories-api"
import { Loader2, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Category {
  id: number
  name: string
  user_id: number
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [editCategoryName, setEditCategoryName] = useState("")
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()

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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
                        <span className="font-medium">{category.name}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/transactions?category=${category.id}`)}
                        >
                          Ver transacciones
                        </Button>
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