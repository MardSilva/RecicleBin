import { api } from "@/lib/api"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

interface Props {
  params: { nome: string }
}

export default async function DiaPage({ params }: Props) {
  const diaSemana = decodeURIComponent(params.nome)

  let coleta = null
  try {
    coleta = await api.getDia(diaSemana)
  } catch (err) {
    return notFound()
  }

  if (!coleta) return notFound()

  const getTipoColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "orgânicos":
        return "bg-green-100 text-green-800 border-green-200"
      case "metal/plástico":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "papel/cartão":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {coleta.dia_semana}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <span className="mr-2">Tipo de Coleta:</span>
              <Badge className={getTipoColor(coleta.tipo_coleta)}>{coleta.tipo_coleta}</Badge>
            </div>

            {coleta.observacao && (
              <div className="text-gray-600 text-sm mt-2">
                <strong>Observação:</strong> {coleta.observacao}
              </div>
            )}

            <Link href={`/editar/${encodeURIComponent(coleta.dia_semana)}`}>
              <Button variant="outline" className="mt-4">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
