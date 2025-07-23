"use client"

import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Coleta } from "@/types"
import { useActionState, useFormStatus } from "react"
import { updateColetaAction } from "@/app/actions" // Importe o Server Action
import { useState } from "react"

type Props = {
  coleta: Coleta
}

export function FormularioEdicao({ coleta }: Props) {
  // Use useActionState para gerir o estado da submissão do formulário
  const [state, formAction] = useActionState(updateColetaAction, {
    success: false,
    message: null,
  })

  // Use useFormStatus para obter o estado de submissão do formulário
  const { pending } = useFormStatus()

  // Os estados para os inputs controlados podem permanecer se desejar,
  // mas o formulário enviará os valores diretamente via FormData.
  // Para simplificar, podemos usar defaultValue e deixar o FormData lidar com isso.
  // Ou manter os estados para validação em tempo real, se necessário.
  // Por enquanto, vamos manter os estados para os inputs controlados para consistência.
  const [tipoColeta, setTipoColeta] = useState(coleta.tipo_coleta)
  const [observacao, setObservacao] = useState(coleta.observacao || "")

  const tiposColeta = ["orgânicos", "metal/plástico", "papel/cartão", "sem coleta", "vidro", "têxteis"]

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="dia_semana" value={coleta.dia_semana} />
      {state.message && (
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
          name="tipo_coleta" // Adicione esta linha
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

      <div>
        <label htmlFor="observacao" className="block text-sm font-medium text-gray-700">
          Observação
        </label>
        <textarea
          id="observacao"
          name="observacao" // Adicione esta linha
          placeholder="Ex: Feriado municipal, alteração temporária..."
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
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