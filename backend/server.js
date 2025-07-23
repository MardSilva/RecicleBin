const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
require("dotenv").config()

const { Pool } = require("pg")

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20, // máximo de conexões
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Eventos de conexão do pool
pool.on("connect", () => {
  console.log("✅ Nova conexão PostgreSQL estabelecida")
})

pool.on("error", (err) => {
  console.error("❌ Erro inesperado no PostgreSQL:", err)
})

// Função para inicializar a base de dados (criar tabela e popular dados iniciais)
async function initDatabase() {
  const client = await pool.connect()
  try {
    console.log("🔄 Verificando/criando tabela coletas...")

    // Criar tabela se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS coletas (
        id SERIAL PRIMARY KEY,
        dia_semana VARCHAR(20) NOT NULL UNIQUE,
        tipo_coleta VARCHAR(50) NOT NULL,
        observacao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Verificar se há dados na tabela
    const countResult = await client.query("SELECT COUNT(*) FROM coletas")
    const count = Number.parseInt(countResult.rows[0].count)

    console.log(`📊 Registros existentes: ${count}`)

    // Popular dados iniciais se a tabela estiver vazia
    if (count === 0) {
      console.log("🔄 Inserindo dados iniciais da semana...")

      const dadosIniciais = [
        ["segunda-feira", "orgânicos"],
        ["terça-feira", "metal/plástico"],
        ["quarta-feira", "orgânicos"],
        ["quinta-feira", "papel/cartão"],
        ["sexta-feira", "orgânicos"],
        ["sábado", "metal/plástico"],
        ["domingo", "sem coleta"],
      ]

      for (const [dia, tipo] of dadosIniciais) {
        await client.query("INSERT INTO coletas (dia_semana, tipo_coleta) VALUES ($1, $2)", [dia, tipo])
        console.log(`  ✅ ${dia}: ${tipo}`)
      }

      console.log("🎉 Dados iniciais inseridos com sucesso!")
    } else {
      console.log("✅ Tabela já possui dados, pulando inicialização")
    }

    // Testar uma query simples para confirmar a conexão
    const testResult = await client.query("SELECT dia_semana, tipo_coleta FROM coletas LIMIT 1")
    console.log("🧪 Teste de query:", testResult.rows[0])
  } catch (error) {
    console.error("❌ ERRO ao inicializar base de dados:", error)
    throw error
  } finally {
    client.release() // Libera o cliente de volta para o pool
  }
}

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(helmet()) // Segurança básica
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Para desenvolvimento local do frontend
      process.env.FRONTEND_URL, // URL do frontend em produção (Vercel)
      /\.vercel\.app$/, // Permite qualquer subdomínio .vercel.app
    ].filter(Boolean), // Remove entradas nulas/indefinidas
    credentials: true, // Permite o envio de cookies de credenciais
  }),
)
app.use(express.json()) // Para parsear JSON no corpo das requisições

// Rotas da API
// Health check (essencial para serviços como Render)
app.get("/health", (req, res) => {
  res.json({
    status: "✅ OK",
    message: "API Coleta de Lixo - São João de Ver",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: process.env.DATABASE_URL ? "✅ Conectado" : "❌ Não configurado",
  })
})

// GET /api/semana - Retorna todos os dias de coleta da semana
app.get("/api/semana", async (req, res) => {
  try {
    console.log("🔍 Buscando coletas da semana...")

    const result = await pool.query(`
      SELECT id, dia_semana, tipo_coleta, observacao, updated_at
      FROM coletas 
      ORDER BY 
        CASE dia_semana
          WHEN 'segunda-feira' THEN 1
          WHEN 'terça-feira' THEN 2
          WHEN 'quarta-feira' THEN 3
          WHEN 'quinta-feira' THEN 4
          WHEN 'sexta-feira' THEN 5
          WHEN 'sábado' THEN 6
          WHEN 'domingo' THEN 7
        END
    `)

    console.log(`✅ Encontrados ${result.rows.length} registros`)

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
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

// GET /api/dia/:nome - Retorna a coleta de um dia específico
app.get("/api/dia/:nome", async (req, res) => {
  try {
    const diaSemana = decodeURIComponent(req.params.nome).toLowerCase()
    console.log(`🔍 Buscando coleta para: ${diaSemana}`)

    const result = await pool.query(
      "SELECT id, dia_semana, tipo_coleta, observacao, updated_at FROM coletas WHERE LOWER(dia_semana) = $1",
      [diaSemana],
    )

    if (result.rows.length === 0) {
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

    console.log(`✅ Encontrado: ${result.rows[0].dia_semana} - ${result.rows[0].tipo_coleta}`)

    res.json({
      success: true,
      data: result.rows[0],
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

// PUT /api/dia/:nome - Atualiza a coleta de um dia específico
app.put("/api/dia/:nome", async (req, res) => {
  try {
    const diaSemana = decodeURIComponent(req.params.nome).toLowerCase()
    const { tipo_coleta, observacao } = req.body

    console.log(`🔄 Atualizando ${diaSemana}:`, { tipo_coleta, observacao })

    // Validação básica
    if (!tipo_coleta || tipo_coleta.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Tipo de coleta é obrigatório",
        received: { tipo_coleta, observacao },
      })
    }

    // Verificar se o dia existe antes de tentar atualizar
    const checkResult = await pool.query("SELECT id FROM coletas WHERE LOWER(dia_semana) = $1", [diaSemana])

    if (checkResult.rows.length === 0) {
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

    // Executar a atualização
    const result = await pool.query(
      `
      UPDATE coletas 
      SET tipo_coleta = $1, observacao = $2, updated_at = CURRENT_TIMESTAMP
      WHERE LOWER(dia_semana) = $3
      RETURNING id, dia_semana, tipo_coleta, observacao, updated_at
    `,
      [tipo_coleta.trim(), observacao?.trim() || null, diaSemana],
    )

    console.log(`✅ Atualizado com sucesso: ${result.rows[0].dia_semana}`)

    res.json({
      success: true,
      message: "Coleta atualizada com sucesso",
      data: result.rows[0],
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
    availableEndpoints: ["/health", "/api/semana", "/api/dia/:nome"],
  })
})

// Função para iniciar o servidor
async function startServer() {
  try {
    console.log("🔄 Inicializando base de dados...")
    await initDatabase() // Garante que a base de dados está pronta antes de iniciar o servidor
    console.log("✅ Base de dados pronta!")

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
      console.log(`📍 Health check: http://localhost:${PORT}/health`)
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`)
      console.log(`🗄️  Status da Base de Dados: ${process.env.DATABASE_URL ? "✅ OK" : "❌ Não configurado"}`)
    })
  } catch (error) {
    console.error("❌ ERRO CRÍTICO ao iniciar o servidor:", error)
    process.exit(1) // Sai do processo com erro
  }
}

startServer() // Chama a função para iniciar o servidor
