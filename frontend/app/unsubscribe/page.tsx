"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Mail } from "lucide-react"

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Token de cancelamento não fornecido")
      return
    }

    const unsubscribe = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/emails/unsubscribe?token=${token}`)
        const data = await response.json()

        if (data.success) {
          setStatus("success")
          setMessage(data.message)
          setEmail(data.email)
        } else {
          setStatus("error")
          setMessage(data.error)
        }
      } catch (error) {
        setStatus("error")
        setMessage("Erro ao processar cancelamento")
      }
    }

    unsubscribe()
  }, [token])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              Cancelamento de Subscrição
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {status === "loading" && (
              <div className="py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Processando cancelamento...</p>
              </div>
            )}

            {status === "success" && (
              <div className="py-8">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-green-800 mb-2">Subscrição Cancelada</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                {email && (
                  <p className="text-sm text-gray-500">
                    O email <strong>{email}</strong> foi removido da nossa lista de envios.
                  </p>
                )}
              </div>
            )}

            {status === "error" && (
              <div className="py-8">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-red-800 mb-2">Erro no Cancelamento</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                <p className="text-sm text-gray-500">
                  Se continuar a ter problemas, contacte-nos diretamente através do email fornecido nos nossos envios.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
