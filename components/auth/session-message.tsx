"use client"

import { AlertTriangle, Clock, X } from "lucide-react"
import { useEffect, useState } from "react"

export function SessionMessage() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const reason = sessionStorage.getItem("logout_reason")
    if (reason) {
      setMessage(reason)
      sessionStorage.removeItem("logout_reason")
    }
  }, [])

  if (!message) return null

  const isInactivity = message.includes("inactividad")

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm mb-4 ${
        isInactivity
          ? "bg-amber-50 border-amber-200 text-amber-800"
          : "bg-blue-50 border-blue-200 text-blue-800"
      }`}
    >
      {isInactivity ? (
        <Clock className="w-4 h-4 mt-0.5 shrink-0" />
      ) : (
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
      )}
      <span className="flex-1">{message}</span>
      <button
        onClick={() => setMessage(null)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}