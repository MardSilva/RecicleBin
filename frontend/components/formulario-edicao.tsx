"use client"

import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Coleta } from "@/lib/api" // Ou "@/types" se for o caso
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { updateColetaAction } from "@/app/actions"
// Removido: import { useState } from "react"

type Props = {
  coleta: Coleta
}

export function FormularioEdicao({ coleta }: Props) {
  const [state, formAction] = useActionState(updateColetaAction, {
    success: false,
    message: null,
  })

  const { pending } = useFormStatus()

  // Removido: const [tipoColeta, setTipoColeta] = useState(coleta.tipo_coleta)
  // Removido: const [observacao, setObservacao] = useState(coleta.observacao || "")

  const tiposColeta = ["orgânicos", "metal/plástico", "papel/cartão", "sem coleta", "vidro", "têxteis"]

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="dia_semana" value={coleta.dia_semana} />
      {state.message && state.message !== "NEXT_REDIRECT" && (
        <div
          className={`mb-4 border rounded-lg p-3 ${state.success ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
        >
          <p className="text-sm">❌ {state.message}</p>
        </div>
      )}

      <div>
        <label htmlFor="tipo-coleta" className="block text-sm font-medium text-gray-700">
          Tipo de Coleta
        </label>
        <select
          id="tipo-coleta"
          name="tipo_coleta"
          defaultValue={coleta.tipo_coleta} // Alterado de 'value' para 'defaultValue'
          // Removido: onChange={(e) => setTipoColeta(e.target.value)}
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

      <div>
        <label htmlFor="observacao" className="block text-sm font-medium text-gray-700">
          Observação
        </label>
        <textarea
          id="observacao"
          name="observacao"
          placeholder="Ex: Feriado municipal, alteração temporária..."
          defaultValue={coleta.observacao || ""} // Alterado de 'value' para 'defaultValue'
          // Removido: onChange={(e) => setObservacao(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={pending} className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          {pending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  )
}
