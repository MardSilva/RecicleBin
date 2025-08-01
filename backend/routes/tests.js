const express = require("express")
const SystemTester = require("../tests/test-system")

const router = express.Router()

// ===== GET /api/tests/run =====
router.get("/run", async (req, res) => {
  try {
    console.log("🧪 Executando testes do sistema...")

    const tester = new SystemTester()
    const report = await tester.generateTestReport()

    res.json({
      success: true,
      message: report.summary.success ? "Todos os testes passaram!" : "Alguns testes falharam",
      data: report,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Erro ao executar testes:", error)
    res.status(500).json({
      success: false,
      error: "Erro ao executar testes",
      details: error.message,
    })
  }
})

// ===== GET /api/tests/health =====
router.get("/health", async (req, res) => {
  try {
    const dataService = require("../services/dataService")

    // Testes básicos de saúde
    const coletas = await dataService.getColetas()
    const emailData = await dataService.getEmailSubscriptions()
    const template = await dataService.getEmailTemplate()

    const health = {
      status: "healthy",
      checks: {
        coletas: {
          status: coletas.length === 7 ? "ok" : "warning",
          count: coletas.length,
          expected: 7,
        },
        emails: {
          status: "ok",
          totalSubscriptions: emailData.metadata.total_subscriptions,
          activeSubscriptions: emailData.metadata.active_subscriptions,
        },
        template: {
          status: template && template.subject ? "ok" : "error",
          hasSubject: !!template?.subject,
        },
        storage: {
          status: "ok",
          type: "JSON Files",
        },
      },
      timestamp: new Date().toISOString(),
    }

    // Determinar status geral
    const hasErrors = Object.values(health.checks).some((check) => check.status === "error")
    const hasWarnings = Object.values(health.checks).some((check) => check.status === "warning")

    if (hasErrors) health.status = "unhealthy"
    else if (hasWarnings) health.status = "degraded"

    res.json({
      success: true,
      data: health,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro no health check",
      details: error.message,
    })
  }
})

module.exports = router
