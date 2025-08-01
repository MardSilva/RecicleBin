import { dataService } from "@/lib/dataService"
import { CalendarioColetas } from "@/components/calendario-coletas"
import { EmailSubscription } from "@/components/email-subscription"

export default async function HomePage() {
  let coletas = []
  let error = null

  try {
    coletas = await dataService.getColetas()
  } catch (err) {
    error = err instanceof Error ? err.message : "Erro ao carregar dados"
    console.error("Erro ao buscar coletas:", err)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Coleta de Lixo - São João de Ver</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">❌ {error}</p>
            <p className="text-red-600 text-sm mt-2">Erro ao carregar dados do sistema.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coleta de Lixo - São João de Ver</h1>
          <p className="text-gray-600">Horários e tipos de coleta seletiva na freguesia</p>
        </header>

        <CalendarioColetas coletas={coletas} />

        <div className="mt-12">
          <EmailSubscription />
        </div>
      </div>
    </div>
  )
}
