import { TestPanel } from "@/components/test-panel"

export default function TestsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Testes do Sistema</h1>
          <p className="text-gray-600">Verificação completa das funcionalidades JSON</p>
        </header>

        <TestPanel />
      </div>
    </div>
  )
}
