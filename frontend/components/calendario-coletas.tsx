"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Edit } from "lucide-react"
import Link from "next/link"
import type { Coleta } from "@/lib/api"

interface Props {
  coletas: Coleta[]
}

export function CalendarioColetas({ coletas }: Props) {
  const hoje = new Date().toLocaleDateString("pt-PT", { weekday: "long" }).toLowerCase()

  const getTipoColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "orgânicos":
        return "bg-green-100 text-green-800 border-green-200"
      case "metal/plástico":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "papel/cartão":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "vidro":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "resíduos":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "sem coleta":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-purple-100 text-purple-800 border-purple-200"
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "orgânicos":
        return "🗑️"
      case "metal/plástico":
        return "♻️"
      case "papel/cartão":
        return "📄"
      case "vidro":
        return "🍶"
      case "resíduos":
        return "🥬"
      case "sem coleta":
        return "🚫"
      default:
        return "📦"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {coletas.map((coleta) => {
        const isHoje = coleta.dia_semana === hoje

        return (
          <Card
            key={coleta.id}
            className={`transition-all hover:shadow-md ${isHoje ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {coleta.dia_semana}
                  {isHoje && (
                    <Badge variant="secondary" className="text-xs">
                      Hoje
                    </Badge>
                  )}
                </CardTitle>
                <Link href={`/editar/${encodeURIComponent(coleta.dia_semana)}`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getTipoIcon(coleta.tipo_coleta)}</span>
                <Badge className={getTipoColor(coleta.tipo_coleta)} variant="secondary">
                  {coleta.tipo_coleta}
                </Badge>
              </div>

              {coleta.observacao && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Obs:</strong> {coleta.observacao}
                </p>
              )}

              <Link href={`/dia/${encodeURIComponent(coleta.dia_semana)}`}>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Ver detalhes
                </Button>
              </Link>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
