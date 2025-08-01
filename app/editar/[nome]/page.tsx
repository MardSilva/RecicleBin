import { dataService } from "@/lib/dataService"
import { notFound } from "next/navigation"
import { FormularioEdicao } from "@/components/formulario-edicao"

interface Props {
  params: { nome: string }
}

export default async function EditarPage({ params }: Props) {
  const diaSemana = decodeURIComponent(params.nome)

  let coleta = null
  let error = null

  try {
    coleta = await dataService.getColetaByDia(diaSemana)
  } catch (err) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <FormularioEdicao coleta={coleta} />
      </div>
    </div>
  )
}
