const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
require("dotenv").config()

const coletasRoutes = require("./routes/coletas")
const { initDatabase } = require("./database/connection")

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(helmet())
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Desenvolvimento
      process.env.FRONTEND_URL, // Produção
    ].filter(Boolean),
    credentials: true,
  }),
)
app.use(express.json())

// Routes
app.use("/api", coletasRoutes)

// Health check (IMPORTANTE para Railway)
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API de Coleta de Lixo - São João de Ver",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err.stack)
  res.status(500).json({
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === "development" ? err.message : "Algo deu errado!",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint não encontrado" })
})

// Start server
async function startServer() {
  try {
    console.log("🔄 Inicializando base de dados...")
    await initDatabase()
    console.log("✅ Base de dados inicializada")

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
      console.log(`📍 Health check: http://localhost:${PORT}/health`)
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error)
    process.exit(1)
  }
}

startServer()
