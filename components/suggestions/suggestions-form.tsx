"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Loader2 } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

declare global {
  interface Window {
    emailjs: {
      init: (config: { publicKey: string }) => void
      send: (
        serviceId: string,
        templateId: string,
        params: Record<string, string>
      ) => Promise<{ status: number; text: string }>
    }
  }
}

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ""
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ""
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""

const TYPE_LABELS: Record<string, string> = {
  feature: "Nueva Funcionalidad",
  improvement: "Mejora",
  bug: "Reporte de Error",
  other: "Otro",
}

export function SuggestionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [emailjsReady, setEmailjsReady] = useState(false)
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [type, setType] = useState("")
  const [suggestion, setSuggestion] = useState("")

  useEffect(() => {
    if (document.getElementById("emailjs-sdk")) {
      if (window.emailjs) {
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY })
        setEmailjsReady(true)
      }
      return
    }

    const script = document.createElement("script")
    script.id = "emailjs-sdk"
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
    script.async = true
    script.onload = () => {
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY })
      setEmailjsReady(true)
    }
    script.onerror = () => {
      console.error("No se pudo cargar EmailJS")
    }
    document.head.appendChild(script)
  }, [])

  const buildMessage = () => {
    const typeLabel = TYPE_LABELS[type] || type
    const body = `Hola Vicente, soy ${name} te escribo desde el buzón de sugerencias de FinTrack para compartir lo siguiente:

${suggestion}

---
Enviado por: ${name} (${email})
Tipo: ${typeLabel}`

    return { subject: typeLabel, body }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !type || !suggestion.trim()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, rellena todos los campos antes de enviar.",
        variant: "destructive",
      })
      return
    }

    if (!emailjsReady) {
      toast({
        title: "Servicio no disponible",
        description: "El servicio de email aún está cargando. Espera un momento e inténtalo de nuevo.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { subject, body } = buildMessage()

      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        subject,
        message: body,
        from_name: name,
        from_email: email,
        to_email: "vicentehernandezmacia@gmail.com",
        suggestion_type: TYPE_LABELS[type] || type,
      })

      setIsSuccess(true)
      toast({
        title: "¡Sugerencia enviada!",
        description: "Gracias por tu feedback. Lo revisaré pronto.",
      })

      setName("")
      setEmail("")
      setType("")
      setSuggestion("")
    } catch (error: any) {
      console.error("Error enviando email:", error)
      toast({
        title: "Error al enviar",
        description:
          "No se pudo enviar la sugerencia. Por favor, inténtalo de nuevo o contacta directamente en vicentehernandezmacia@gmail.com.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">¡Mensaje enviado!</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Tu sugerencia ha llegado correctamente. Gracias por ayudar a mejorar FinTrack.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setIsSuccess(false)}
        >
          Enviar otra sugerencia
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          placeholder="Tu nombre"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="tu@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Sugerencia</Label>
        <Select name="type" required value={type} onValueChange={setType}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feature">Nueva Funcionalidad</SelectItem>
            <SelectItem value="improvement">Mejora</SelectItem>
            <SelectItem value="bug">Reporte de Error</SelectItem>
            <SelectItem value="other">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="suggestion">Tu Sugerencia</Label>
        <Textarea
          id="suggestion"
          name="suggestion"
          placeholder="Describe tu sugerencia o problema en detalle..."
          className="min-h-[150px] resize-none"
          required
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || !emailjsReady}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar Sugerencia"
        )}
      </Button>

      {!emailjsReady && (
        <p className="text-xs text-muted-foreground text-center">
          Cargando servicio de email...
        </p>
      )}
    </form>
  )
}