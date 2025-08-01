const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
require("dotenv").config()

const dataService = require("./services/dataService")

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(helmet())
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL, /\.vercel\.app$/].filter(Boolean),
    credentials: true,
  }),
)
app.use(express.json())

// Importar rotas
const emailRoutes = require("./routes/emails")
const testRoutes = require("./routes/tests")

// Função para inicializar dados
async function initializeData() {
  try {
    console.log("🔄 Inicializando sistema de dados JSON...")

    const coletas = await dataService.getColetas()
    const emailData = await dataService.getEmailSubscriptions()
    const template = await dataService.getEmailTemplate()

    console.log(`✅ Sistema inicializado com ${coletas.length} coletas`)
    console.log(`✅ ${emailData.metadata.active_subscriptions} subscrições ativas de email`)
    console.log("✅ Template de email carregado")
  } catch (error) {
    console.error("❌ Erro ao inicializar dados:", error)
    throw error
  }
}

// Rotas da API
app.get("/health", async (req, res) => {
  try {
    const coletas = await dataService.getColetas()
    const emailData = await dataService.getEmailSubscriptions()

    res.json({
      status: "✅ OK",
      message: "API Coleta de Lixo - São João de Ver (JSON Storage)",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      storage: "✅ JSON Files",
      email: process.env.EMAIL_USER ? "✅ Configurado" : "❌ Não configurado",
      data: {
        coletas: coletas.length,
        emailSubscriptions: emailData.metadata.active_subscriptions,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: "❌ ERROR",
      message: "Erro no sistema",
      error: error.message,
    })
  }
})

// Rotas de coletas
app.get("/api/semana", async (req, res) => {
  try {
    console.log("🔍 Buscando coletas da semana...")

    const coletas = await dataService.getColetas()

    const diasOrdem = [
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
      "domingo",
    ]
    const coletasOrdenadas = coletas.sort((a, b) => {
      return diasOrdem.indexOf(a.dia_semana) - diasOrdem.indexOf(b.dia_semana)
    })

    console.log(`✅ Encontrados ${coletasOrdenadas.length} registros`)

    res.json({
      success: true,
      data: coletasOrdenadas,
      total: coletasOrdenadas.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Erro ao buscar semana:", error)
    res.status(500).json({
      success: false,
      error: "Erro ao buscar coletas da semana",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

app.get("/api/dia/:nome", async (req, res) => {
  try {
    const diaSemana = decodeURIComponent(req.params.nome).toLowerCase()
    console.log(`🔍 Buscando coleta para: ${diaSemana}`)

    const coleta = await dataService.getColetaByDia(diaSemana)

    if (!coleta) {
      console.log(`❌ Dia não encontrado: ${diaSemana}`)
      return res.status(404).json({
        success: false,
        error: "Dia da semana não encontrado",
        availableDays: [
          "segunda-feira",
          "terça-feira",
          "quarta-feira",
          "quinta-feira",
          "sexta-feira",
          "sábado",
          "domingo",
        ],
      })
    }

    console.log(`✅ Encontrado: ${coleta.dia_semana} - ${coleta.tipo_coleta}`)

    res.json({
      success: true,
      data: coleta,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Erro ao buscar dia:", error)
    res.status(500).json({
      success: false,
      error: "Erro ao buscar coleta do dia",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

app.put("/api/dia/:nome", async (req, res) => {
  try {
    const diaSemana = decodeURIComponent(req.params.nome).toLowerCase()
    const { tipo_coleta, observacao } = req.body

    console.log(`🔄 Atualizando ${diaSemana}:`, { tipo_coleta, observacao })

    if (!tipo_coleta || tipo_coleta.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Tipo de coleta é obrigatório",
        received: { tipo_coleta, observacao },
      })
    }

    const coletaAtualizada = await dataService.updateColeta(diaSemana, tipo_coleta.trim(), observacao?.trim())

    if (!coletaAtualizada) {
      return res.status(404).json({
        success: false,
        error: "Dia da semana não encontrado",
        availableDays: [
          "segunda-feira",
          "terça-feira",
          "quarta-feira",
          "quinta-feira",
          "sexta-feira",
          "sábado",
          "domingo",
        ],
      })
    }

    console.log(`✅ Atualizado com sucesso: ${coletaAtualizada.dia_semana}`)

    res.json({
      success: true,
      message: "Coleta atualizada com sucesso",
      data: coletaAtualizada,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Erro ao atualizar:", error)
    res.status(500).json({
      success: false,
      error: "Erro ao atualizar coleta",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Rotas de email e testes
app.use("/api/emails", emailRoutes)
app.use("/api/tests", testRoutes)

// Middleware de tratamento de erros genérico
app.use((err, req, res, next) => {
  console.error("❌ ERRO:", err.stack)
  res.status(500).json({
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === "development" ? err.message : "Algo deu errado!",
  })
})

// Handler para rotas não encontradas (404)
app.use("*", (req, res) => {
  res.status(404).json({
    error: "❌ Endpoint não encontrado",
    availableEndpoints: [
      "/health",
      "/api/semana",
      "/api/dia/:nome",
      "/api/emails/subscribe",
      "/api/emails/send-calendar",
      "/api/tests/run",
      "/api/tests/health",
    ],
  })
})

// Função para iniciar o servidor
async function startServer() {
  try {
    console.log("🔄 Inicializando sistema...")
    await initializeData()
    console.log("✅ Sistema pronto!")

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
      console.log(`📍 Health check: http://localhost:${PORT}/health`)
      console.log(`🧪 Testes: http://localhost:${PORT}/api/tests/run`)
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`)
      console.log(`🗄️  Armazenamento: ✅ Arquivos JSON`)
      console.log(`📧 Status do Email: ${process.env.EMAIL_USER ? "✅ OK" : "❌ Não configurado"}`)
    })
  } catch (error) {
    console.error("❌ ERRO CRÍTICO ao iniciar o servidor:", error)
    process.exit(1)
  }
}

startServer()
