"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, RefreshCw, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"

interface TestResult {
  test: string
  status: "PASS" | "FAIL" | "SKIP"
  message: string
  details?: any
  timestamp: string
}

interface TestReport {
  timestamp: string
  environment: string
  summary: {
    passed: number
    failed: number
    skipped: number
    total: number
    success: boolean
  }
  details: TestResult[]
}

export function TestPanel() {
  const [isRunning, setIsRunning] = useState(false)
  const [report, setReport] = useState<TestReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runTests = async () => {
    setIsRunning(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tests/run`)
      const data = await response.json()

      if (data.success) {
        setReport(data.data)
      } else {
        setError(data.error || "Erro ao executar testes")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro de conexão")
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASS":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "FAIL":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "SKIP":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASS":
        return "bg-green-100 text-green-800 border-green-200"
      case "FAIL":
        return "bg-red-100 text-red-800 border-red-200"
      case "SKIP":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Painel de Testes do Sistema
          </CardTitle>
          <Button onClick={runTests} disabled={isRunning}>
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Executar Testes
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Verifique se todas as funcionalidades do sistema JSON estão funcionando corretamente
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-red-800 font-medium">Erro nos Testes</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {report && (
          <div className="space-y-6">
            {/* Resumo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-800">{report.summary.passed}</div>
                <div className="text-sm text-green-600">Passou</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-800">{report.summary.failed}</div>
                <div className="text-sm text-red-600">Falhou</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-800">{report.summary.skipped}</div>
                <div className="text-sm text-yellow-600">Pulou</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-800">{report.summary.total}</div>
                <div className="text-sm text-blue-600">Total</div>
              </div>
            </div>

            {/* Status Geral */}
            <div
              className={`p-4 rounded-lg border ${
                report.summary.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {report.summary.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${report.summary.success ? "text-green-800" : "text-red-800"}`}>
                  {report.summary.success
                    ? "🎉 Todos os testes passaram! Sistema funcionando perfeitamente."
                    : "⚠️ Alguns testes falharam. Verifique os detalhes abaixo."}
                </span>
              </div>
            </div>

            {/* Detalhes dos Testes */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Detalhes dos Testes</h3>
              {report.details.map((test, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <span className="font-medium">{test.test}</span>
                    </div>
                    <Badge className={getStatusColor(test.status)} variant="secondary">
                      {test.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{test.message}</p>
                  {test.details && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-500 hover:text-gray-700">Ver detalhes</summary>
                      <pre className="mt-2 bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </details>
                  )}
                  <div className="text-xs text-gray-500 mt-2">{new Date(test.timestamp).toLocaleString("pt-PT")}</div>
                </div>
              ))}
            </div>

            {/* Informações do Relatório */}
            <div className="text-xs text-gray-500 border-t pt-4">
              <p>Relatório gerado em: {new Date(report.timestamp).toLocaleString("pt-PT")}</p>
              <p>Ambiente: {report.environment}</p>
            </div>
          </div>
        )}

        {!report && !error && !isRunning && (
          <div className="text-center py-8 text-gray-500">
            <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Clique em "Executar Testes" para verificar o sistema</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
