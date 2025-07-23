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
            key={coleta.dia_semana}
            className={`border ${isHoje ? "border-blue-500 bg-blue-50" : ""}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {coleta.dia_semana.charAt(0).toUpperCase() + coleta.dia_semana.slice(1)}
                {isHoje && <span className="text-sm ml-2 text-muted-foreground">Hoje</span>}
              </CardTitle>

              <Link href={`/editar/${encodeURIComponent(coleta.dia_semana)}`}>
                <Edit className="w-4 h-4 text-muted-foreground cursor-pointer" />
              </Link>
            </CardHeader>

            <CardContent>
              <div className="mb-2 flex items-center gap-2">
                <span>{getTipoIcon(coleta.tipo_coleta)}</span>
                <Badge className={getTipoColor(coleta.tipo_coleta)}>
                  {coleta.tipo_coleta}
                </Badge>
              </div>

              <Link href={`/dia/${encodeURIComponent(coleta.dia_semana)}`}>
                <Button variant="outline" className="w-full mt-2">
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
