import { api } from "@/lib/api"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Props {
  params: { nome: string }
}

export default async function DiaPage({ params }: Props) {
  const diaSemana = decodeURIComponent(params.nome)

  let coleta = null
  let error = null

  try {
    coleta = await api.getDia(diaSemana)
  } catch (err) {
    if (err instanceof Error && "status" in err && (err as any).status === 404) {
      notFound()
    }
    error = err instanceof Error ? err.message : "Erro ao carregar dados"
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">❌ {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!coleta) {
    notFound()
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "orgânicos":
        return "bg-green-100 text-green-800"
      case "metal/plástico":
        return "bg-yellow-100 text-yellow-800"
      case "papel/cartão":
        return "bg-blue-100 text-blue-800"
      case "sem coleta":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-purple-100 text-purple-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao calendário
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 capitalize">
                <Calendar className="w-5 h-5" />
                {coleta.dia_semana}
              </CardTitle>
              <Link href={`/editar/${encodeURIComponent(coleta.dia_semana)}`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Tipo de Coleta:</h3>
              <Badge className={getTipoColor(coleta.tipo_coleta)} variant="secondary">
                {coleta.tipo_coleta}
              </Badge>
            </div>

            {coleta.observacao && (
              <div>
                <h3 className="font-semibold mb-2">Observação:</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{coleta.observacao}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Informações:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Coloque os contentores na rua até às 7h00</li>
                <li>• Retire os contentores após a coleta</li>
                <li>• Em caso de feriado, consulte as alterações</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
