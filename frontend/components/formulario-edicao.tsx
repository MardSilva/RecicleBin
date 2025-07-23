"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { api, type Coleta } from "@/lib/api"

interface Props {
  coleta: Coleta
}

export function FormularioEdicao({ coleta }: Props) {
  const [tipoColeta, setTipoColeta] = useState(coleta.tipo_coleta)
  const [observacao, setObservacao] = useState(coleta.observacao || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const tiposColeta = ["orgânicos", "metal/plástico", "papel/cartão", "sem coleta", "vidro", "têxteis"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await api.updateDia(coleta.dia_semana, tipoColeta, observacao.trim() || undefined)
      router.push(`/dia/${encodeURIComponent(coleta.dia_semana)}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar coleta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href={`/dia/${encodeURIComponent(coleta.dia_semana)}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="capitalize">Editar coleta - {coleta.dia_semana}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="tipo-coleta" className="block text-sm font-medium">
                Tipo de Coleta
              </label>
              <select
                id="tipo-coleta"
                value={tipoColeta}
                onChange={(e) => setTipoColeta(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {tiposColeta.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="observacao" className="block text-sm font-medium">
                Observação (opcional)
              </label>
              <textarea
                id="observacao"
                placeholder="Ex: Feriado municipal, alteração temporária..."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500">
                Use este campo para justificar alterações ou exceções no cronograma normal.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
              <Link href={`/dia/${encodeURIComponent(coleta.dia_semana)}`}>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
