const express = require("express")
const dataService = require("../services/dataService")
const PDFService = require("../services/pdfService")
const EmailService = require("../services/emailService")

const router = express.Router()
const emailService = new EmailService()

// ===== MIDDLEWARE DE LOG =====
router.use((req, res, next) => {
  console.log(`📧 ${req.method} ${req.path} - ${new Date().toISOString()}`)
  next()
})

// ===== POST /api/emails/subscribe =====
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body

    console.log(`📧 Nova subscrição solicitada: ${email}`)

    // Validação básica
    if (!email || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        error: "Email inválido",
      })
    }

    const result = await dataService.addEmailSubscription(email)

    if (result.existing && result.subscription.is_active) {
      return res.status(409).json({
        success: false,
        error: "Este email já está subscrito",
      })
    }

    console.log(`📧 ${result.existing ? "Subscrição reativada" : "Nova subscrição criada"}: ${email}`)

    res.json({
      success: true,
      message: "Email subscrito com sucesso! Receberá o calendário em breve.",
    })
  } catch (error) {
    console.error("❌ Erro ao subscrever email:", error)
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    })
  }
})

// ===== POST /api/emails/send-calendar =====
router.post("/send-calendar", async (req, res) => {
  try {
    console.log("📧 Iniciando envio de calendários...")

    // Buscar coletas da semana
    const coletas = await dataService.getColetas()

    if (coletas.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Nenhuma coleta encontrada",
      })
    }

    // Gerar PDF
    console.log("📄 Gerando PDF do calendário...")
    const pdfBuffer = await PDFService.generateCalendarPDF(coletas)

    // Buscar emails ativos
    const activeEmails = await dataService.getActiveEmails()

    if (activeEmails.length === 0) {
      return res.json({
        success: true,
        message: "PDF gerado, mas nenhum email subscrito encontrado",
        emailsSent: 0,
      })
    }

    console.log(`📧 Enviando para ${activeEmails.length} emails...`)

    // Enviar emails
    const results = []
    for (const email of activeEmails) {
      try {
        const result = await emailService.sendCalendarEmail(email, pdfBuffer)
        results.push({ email: email, success: true, messageId: result.messageId })

        // Atualizar token de unsubscribe
        await dataService.updateUnsubscribeToken(email, result.unsubscribeToken)
      } catch (error) {
        console.error(`❌ Erro ao enviar para ${email}:`, error)
        results.push({ email: email, success: false, error: error.message })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    console.log(`✅ Envio concluído: ${successCount} sucessos, ${failureCount} falhas`)

    res.json({
      success: true,
      message: `Calendários enviados: ${successCount} sucessos, ${failureCount} falhas`,
      emailsSent: successCount,
      emailsFailed: failureCount,
      results: results,
    })
  } catch (error) {
    console.error("❌ Erro ao enviar calendários:", error)
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// ===== GET /api/emails/unsubscribe =====
router.get("/unsubscribe", async (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token de cancelamento não fornecido",
      })
    }

    const subscription = await dataService.unsubscribeByToken(token)

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Token inválido ou expirado",
      })
    }

    console.log(`📧 Subscrição cancelada: ${subscription.email}`)

    res.json({
      success: true,
      message: "Subscrição cancelada com sucesso",
      email: subscription.email,
    })
  } catch (error) {
    console.error("❌ Erro ao cancelar subscrição:", error)
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    })
  }
})

// ===== GET /api/emails/stats =====
router.get("/stats", async (req, res) => {
  try {
    const stats = await dataService.getEmailStats()

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas:", error)
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    })
  }
})

module.exports = router
