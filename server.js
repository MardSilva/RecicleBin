const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3001

// ===== CONFIGURAÇÃO PARA RAILWAY =====
app.use(helmet())
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Desenvolvimento
      process.env.FRONTEND_URL, // Produção Vercel
      /\.vercel\.app$/, // Qualquer subdomínio Vercel
    ].filter(Boolean),
    credentials: true,
  }),
)
app.use(express.json())

// ===== ROTAS =====
// Health check (OBRIGATÓRIO para Railway)
app.get("/health", (req, res) => {
  res.json({
    status: "✅ OK",
    message: "API Coleta de Lixo - São João de Ver",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: process.env.DATABASE_URL ? "✅ Conectado" : "❌ Não configurado",
  })
})

// Importar rotas das coletas
const coletasRoutes = require("./routes/coletas")
app.use("/api", coletasRoutes)

// ===== MIDDLEWARE DE ERRO =====
app.use((err, req, res, next) => {
  console.error("❌ ERRO:", err.stack)
  res.status(500).json({
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === "development" ? err.message : "Algo deu errado!",
  })
})

// 404 para rotas não encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "❌ Endpoint não encontrado",
    availableEndpoints: ["/health", "/api/semana", "/api/dia/:nome"],
  })
})

// ===== INICIALIZAR SERVIDOR =====
async function startServer() {
  try {
    // Inicializar banco de dados
    const { initDatabase } = require("./database/connection")
    console.log("🔄 Inicializando base de dados...")
    await initDatabase()
    console.log("✅ Base de dados pronta!")

    // Iniciar servidor
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
      console.log(`📍 Health: http://localhost:${PORT}/health`)
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`)
      console.log(`🗄️  Database: ${process.env.DATABASE_URL ? "✅ OK" : "❌ Não configurado"}`)
    })
  } catch (error) {
    console.error("❌ ERRO CRÍTICO ao iniciar:", error)
    process.exit(1)
  }
}

startServer()
