"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categoriesApi } from "@/services/categories-api"
import { Loader2, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Category {
  id: number
  name: string
  user_id: number
  transaction_count?: number
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
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
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-row items-center justify-between p-3 rounded-lg border bg-card/50"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{category.name}</span>
                    {category.transaction_count !== undefined && (
                      category.transaction_count > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full w-fit">
                          {category.transaction_count} {category.transaction_count === 1 ? 'transacción' : 'transacciones'}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No hay transacciones asociadas a esta categoría
                        </span>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    onClick={() => router.push(`/transactions?category=${encodeURIComponent(category.name)}`)}
                  >
                    Ver transacciones
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}