"use client"

import { Save, ArrowLeft } from "lucide-react" // Adicionado ArrowLeft
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Adicionado Card components
import type { Coleta } from "@/lib/api" // Ou "@/types" se for o caso
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { updateColetaAction } from "@/app/actions"
import Link from "next/link" // Adicionado Link para o botão Voltar

type Props = {
  coleta: Coleta
}

export function FormularioEdicao({ coleta }: Props) {
  const [state, formAction] = useActionState(updateColetaAction, {
    success: false,
    message: null,
  })

  const { pending } = useFormStatus()

  const tiposColeta = ["orgânicos", "metal/plástico", "papel/cartão", "sem coleta", "vidro", "têxteis"]

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
          {state.message && state.message !== "NEXT_REDIRECT" && (
            <div
              className={`mb-4 border rounded-lg p-3 ${state.success ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
            >
              <p className="text-sm">❌ {state.message}</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="dia_semana" value={coleta.dia_semana} />

            <div className="space-y-2">
              <label htmlFor="tipo-coleta" className="block text-sm font-medium text-gray-700">
                Tipo de Coleta
              </label>
              <select
                id="tipo-coleta"
                name="tipo_coleta"
                defaultValue={coleta.tipo_coleta} // Usar defaultValue
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
              <label htmlFor="observacao" className="block text-sm font-medium text-gray-700">
                Observação (opcional)
              </label>
              <textarea
                id="observacao"
                name="observacao"
                placeholder="Ex: Feriado municipal, alteração temporária..."
                defaultValue={coleta.observacao || ""} // Usar defaultValue
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500">
                Use este campo para justificar alterações ou exceções no cronograma normal.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={pending} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {pending ? "Salvando..." : "Salvar alterações"}
              </Button>
              {/* Manter o botão Cancelar com Link */}
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
