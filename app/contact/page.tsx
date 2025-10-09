import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Mail, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function ContactoPage() {
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
              <Link href="/sugerencias" className="text-muted-foreground hover:text-foreground transition-colors">
                Sugerencias
              </Link>
              <Link href="/contacto" className="text-foreground font-medium">
                Contacto
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-balance">
              Información de <span className="text-primary">Contacto</span>
            </h2>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              Conéctate conmigo a través de mis plataformas profesionales
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* LinkedIn Card */}
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-lg flex items-center justify-center mb-4">
                  <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                </div>
                <CardTitle>LinkedIn</CardTitle>
                <CardDescription>Perfil profesional y networking</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <a
                    href="https://www.linkedin.com/in/vhernandezmacia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    Visitar LinkedIn
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* GitHub Card */}
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-foreground/10 rounded-lg flex items-center justify-center mb-4">
                  <Github className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle>GitHub</CardTitle>
                <CardDescription>Proyectos y código abierto</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <a
                    href="https://github.com/vicelx17"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    Visitar GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>¿Tienes alguna pregunta?</CardTitle>
              <CardDescription>
                No dudes en contactarme a través de LinkedIn o GitHub. Estoy siempre abierto a nuevas oportunidades y
                colaboraciones.
              </CardDescription>
            </CardHeader>
          </Card>
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
