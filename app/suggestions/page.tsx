import { SuggestionForm } from "@/components/suggestions/suggestions-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import Link from "next/link"

export default function SugerenciasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">FinTrack</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/suggestions" className="text-foreground font-medium">
                Sugerencias
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contacto
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-balance">
              Tus <span className="text-primary">Sugerencias</span> Importan
            </h2>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              Ayúdanos a mejorar FinTrack compartiendo tus ideas y comentarios
            </p>
          </div>

          {/* Suggestion Form Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Enviar Sugerencia</CardTitle>
              <CardDescription>
                Comparte tus ideas para nuevas funcionalidades, mejoras o reporta problemas que hayas encontrado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SuggestionForm />
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">💡 Ideas de Funcionalidades</h3>
                <p className="text-sm text-muted-foreground">
                  ¿Tienes una idea para una nueva característica? Nos encantaría escucharla.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">🐛 Reportar Problemas</h3>
                <p className="text-sm text-muted-foreground">
                  ¿Encontraste un error? Ayúdanos a solucionarlo reportándolo aquí.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">FinTrack</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 FinTrack. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
