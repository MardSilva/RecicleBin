"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"

export function EmailSubscription() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/emails/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: data.message })
        setEmail("")
      } else {
        setMessage({ type: "error", text: data.error })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao subscrever. Tente novamente." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Mail className="w-5 h-5" />
          Receber Calendário por Email
        </CardTitle>
        <p className="text-sm text-gray-600">Subscreva-se para receber o calendário de coletas em PDF no seu email</p>
      </CardHeader>
      <CardContent>
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Endereço de Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@exemplo.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <Button type="submit" disabled={isLoading || !email} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? "Subscrevendo..." : "Subscrever"}
          </Button>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          <p>
            ℹ️ Ao subscrever, receberá o calendário de coletas em PDF. Para cancelar a subscrição, contacte-nos ou use o
            link no email recebido.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
