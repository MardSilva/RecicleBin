const fs = require("fs").promises
const path = require("path")

// Importar serviços
const dataService = require("../services/dataService")
const PDFService = require("../services/pdfService")
const EmailService = require("../services/emailService")

class SystemTester {
  constructor() {
    this.results = []
    this.emailService = new EmailService()
  }

  log(test, status, message, details = null) {
    const result = {
      test,
      status, // 'PASS', 'FAIL', 'SKIP'
      message,
      details,
      timestamp: new Date().toISOString(),
    }
    this.results.push(result)

    const emoji = status === "PASS" ? "✅" : status === "FAIL" ? "❌" : "⚠️"
    console.log(`${emoji} ${test}: ${message}`)
    if (details) console.log(`   Details: ${JSON.stringify(details, null, 2)}`)
  }

  async testDataDirectory() {
    try {
      const dataDir = path.join(__dirname, "..", "data")
      await fs.access(dataDir)
      this.log("Data Directory", "PASS", "Diretório de dados existe e é acessível")
      return true
    } catch (error) {
      this.log("Data Directory", "FAIL", "Diretório de dados não encontrado", error.message)
      return false
    }
  }

  async testColetasData() {
    try {
      // Testar leitura de coletas
      const coletas = await dataService.getColetas()

      if (!Array.isArray(coletas)) {
        throw new Error("Coletas não é um array")
      }

      if (coletas.length !== 7) {
        throw new Error(`Esperado 7 coletas, encontrado ${coletas.length}`)
      }

      // Verificar se todos os dias da semana estão presentes
      const diasEsperados = [
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado",
        "domingo",
      ]

      const diasEncontrados = coletas.map((c) => c.dia_semana)
      const diasFaltando = diasEsperados.filter((dia) => !diasEncontrados.includes(dia))

      if (diasFaltando.length > 0) {
        throw new Error(`Dias faltando: ${diasFaltando.join(", ")}`)
      }

      this.log("Coletas Data", "PASS", `${coletas.length} coletas carregadas corretamente`, {
        dias: diasEncontrados,
        tipos: coletas.map((c) => `${c.dia_semana}: ${c.tipo_coleta}`),
      })
      return true
    } catch (error) {
      this.log("Coletas Data", "FAIL", "Erro ao carregar dados de coletas", error.message)
      return false
    }
  }

  async testColetaCRUD() {
    try {
      // Testar busca por dia específico
      const segunda = await dataService.getColetaByDia("segunda-feira")
      if (!segunda) {
        throw new Error("Não foi possível buscar segunda-feira")
      }

      // Testar atualização
      const tipoOriginal = segunda.tipo_coleta
      const observacaoOriginal = segunda.observacao

      const novoTipo = "teste-temporario"
      const novaObservacao = "Teste de atualização"

      const atualizada = await dataService.updateColeta("segunda-feira", novoTipo, novaObservacao)

      if (!atualizada || atualizada.tipo_coleta !== novoTipo) {
        throw new Error("Falha na atualização")
      }

      // Restaurar dados originais
      await dataService.updateColeta("segunda-feira", tipoOriginal, observacaoOriginal)

      this.log("Coletas CRUD", "PASS", "Operações CRUD funcionando corretamente", {
        original: { tipo: tipoOriginal, obs: observacaoOriginal },
        testUpdate: { tipo: novoTipo, obs: novaObservacao },
      })
      return true
    } catch (error) {
      this.log("Coletas CRUD", "FAIL", "Erro nas operações CRUD", error.message)
      return false
    }
  }

  async testEmailSubscriptions() {
    try {
      // Testar subscrição de email
      const testEmail = `test-${Date.now()}@exemplo.com`

      const result = await dataService.addEmailSubscription(testEmail)
      if (!result || !result.subscription) {
        throw new Error("Falha ao adicionar subscrição")
      }

      // Testar busca de emails ativos
      const activeEmails = await dataService.getActiveEmails()
      if (!activeEmails.includes(testEmail)) {
        throw new Error("Email não encontrado na lista ativa")
      }

      // Testar cancelamento
      const token = result.subscription.unsubscribe_token
      const unsubscribed = await dataService.unsubscribeByToken(token)
      if (!unsubscribed || unsubscribed.email !== testEmail) {
        throw new Error("Falha no cancelamento")
      }

      // Verificar se foi removido da lista ativa
      const activeEmailsAfter = await dataService.getActiveEmails()
      if (activeEmailsAfter.includes(testEmail)) {
        throw new Error("Email ainda ativo após cancelamento")
      }

      this.log("Email Subscriptions", "PASS", "Sistema de subscrições funcionando", {
        testEmail,
        token: token.substring(0, 8) + "...",
        activeCountBefore: activeEmails.length,
        activeCountAfter: activeEmailsAfter.length,
      })
      return true
    } catch (error) {
      this.log("Email Subscriptions", "FAIL", "Erro no sistema de subscrições", error.message)
      return false
    }
  }

  async testEmailTemplate() {
    try {
      const template = await dataService.getEmailTemplate()

      if (!template || typeof template !== "object") {
        throw new Error("Template não carregado")
      }

      const requiredFields = ["subject", "greeting", "main_message", "signature"]
      const missingFields = requiredFields.filter((field) => !template[field])

      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${missingFields.join(", ")}`)
      }

      this.log("Email Template", "PASS", "Template de email carregado corretamente", {
        subject: template.subject,
        fieldsCount: Object.keys(template).length,
      })
      return true
    } catch (error) {
      this.log("Email Template", "FAIL", "Erro no template de email", error.message)
      return false
    }
  }

  async testPDFGeneration() {
    try {
      const coletas = await dataService.getColetas()
      const pdfBuffer = await PDFService.generateCalendarPDF(coletas)

      if (!Buffer.isBuffer(pdfBuffer)) {
        throw new Error("PDF não é um buffer válido")
      }

      if (pdfBuffer.length < 1000) {
        throw new Error("PDF muito pequeno, possivelmente corrompido")
      }

      // Verificar se começa com header PDF
      const pdfHeader = pdfBuffer.toString("ascii", 0, 4)
      if (pdfHeader !== "%PDF") {
        throw new Error("PDF não tem header válido")
      }

      this.log("PDF Generation", "PASS", "PDF gerado com sucesso", {
        size: `${Math.round(pdfBuffer.length / 1024)}KB`,
        header: pdfHeader,
      })
      return true
    } catch (error) {
      this.log("PDF Generation", "FAIL", "Erro na geração de PDF", error.message)
      return false
    }
  }

  async testEmailConnection() {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        this.log("Email Connection", "SKIP", "Credenciais de email não configuradas")
        return true
      }

      const isConnected = await this.emailService.verifyConnection()

      if (isConnected) {
        this.log("Email Connection", "PASS", "Conexão com servidor de email OK")
        return true
      } else {
        throw new Error("Falha na verificação da conexão")
      }
    } catch (error) {
      this.log("Email Connection", "FAIL", "Erro na conexão de email", error.message)
      return false
    }
  }

  async testFilePermissions() {
    try {
      const dataDir = path.join(__dirname, "..", "data")
      const testFile = path.join(dataDir, "test-permissions.json")

      // Testar escrita
      await fs.writeFile(testFile, JSON.stringify({ test: true }))

      // Testar leitura
      const content = await fs.readFile(testFile, "utf8")
      const parsed = JSON.parse(content)

      if (!parsed.test) {
        throw new Error("Dados não foram escritos/lidos corretamente")
      }

      // Limpar arquivo de teste
      await fs.unlink(testFile)

      this.log("File Permissions", "PASS", "Permissões de arquivo OK")
      return true
    } catch (error) {
      this.log("File Permissions", "FAIL", "Erro nas permissões de arquivo", error.message)
      return false
    }
  }

  async runAllTests() {
    console.log("🧪 Iniciando testes do sistema JSON...\n")

    const tests = [
      () => this.testDataDirectory(),
      () => this.testFilePermissions(),
      () => this.testColetasData(),
      () => this.testColetaCRUD(),
      () => this.testEmailSubscriptions(),
      () => this.testEmailTemplate(),
      () => this.testPDFGeneration(),
      () => this.testEmailConnection(),
    ]

    let passed = 0
    let failed = 0
    let skipped = 0

    for (const test of tests) {
      try {
        const result = await test()
        if (result) passed++
      } catch (error) {
        failed++
        console.error(`❌ Erro inesperado: ${error.message}`)
      }
    }

    // Contar resultados
    this.results.forEach((result) => {
      if (result.status === "SKIP") skipped++
    })

    console.log("\n📊 RESUMO DOS TESTES:")
    console.log(`✅ Passou: ${passed}`)
    console.log(`❌ Falhou: ${failed}`)
    console.log(`⚠️  Pulou: ${skipped}`)
    console.log(`📝 Total: ${this.results.length}`)

    if (failed === 0) {
      console.log("\n🎉 TODOS OS TESTES PASSARAM! Sistema JSON funcionando perfeitamente.")
    } else {
      console.log("\n⚠️  ALGUNS TESTES FALHARAM. Verifique os detalhes acima.")
    }

    return {
      passed,
      failed,
      skipped,
      total: this.results.length,
      results: this.results,
      success: failed === 0,
    }
  }

  async generateTestReport() {
    const summary = await this.runAllTests()

    const report = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      summary,
      details: this.results,
    }

    // Salvar relatório
    const reportPath = path.join(__dirname, "..", "data", "test-report.json")
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2))

    console.log(`\n📄 Relatório salvo em: ${reportPath}`)
    return report
  }
}

// Executar testes se chamado diretamente
if (require.main === module) {
  const tester = new SystemTester()
  tester.generateTestReport().catch(console.error)
}

module.exports = SystemTester
