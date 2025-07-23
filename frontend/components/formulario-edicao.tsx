"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Coleta } from "@/lib/api"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { updateColetaAction } from "@/app/actions"
import Link from "next/link"

type Props = {
  coleta: Coleta
}

export function FormularioEdicao({ coleta }: Props) {
  const [state, formAction] = useActionState(updateColetaAction, {
    success: false,
    message: null,
  })

  const { pending } = useFormStatus()

  const [tipoColeta, setTipoColeta] = useState(coleta.tipo_coleta)
  const [observacao, setObservacao] = useState(coleta.observacao || "")

  const tiposColeta = [
    "orgânicos",
    "metal/plástico",
    "papel/cartão",
    "sem coleta",
    "vidro",
    "têxteis",
  ]

  // ✅ Substituindo toast por alert()
  useEffect(() => {
    if (state.success) {
      alert("✅ Alterações salvas com sucesso.")
    } else if (state.message) {
      alert(`❌ Erro ao salvar: ${state.message}`)
    }
  }, [state])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formAction(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="dia_semana" value={coleta.dia_semana} />

      <Card>
        <CardHeader>
          <CardTitle>Editar Coleta - {coleta.dia_semana}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <label htmlFor="tipo_coleta" className="block font-medium mb-1">
              Tipo de Coleta
            </label>
            <select
              id="tipo_coleta"
              name="tipo_coleta"
              value={tipoColeta}
              onChange={(e) => setTipoColeta(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              disabled={pending}
            >
              {tiposColeta.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="observacao" className="block font-medium mb-1">
              Observação (opcional)
            </label>
            <textarea
              id="observacao"
              name="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Ex: Feriado municipal, alteração temporária..."
              rows={3}
              disabled={pending}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Use este campo para justificar alterações ou exceções no cronograma normal.
            </p>
          </div>

          <div className="flex justify-between mt-6">
            <Link
              href="/"
              className="text-blue-600 hover:underline inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
