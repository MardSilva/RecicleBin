const { Pool } = require("pg")

// ===== CONFIGURAÇÃO POSTGRESQL =====
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  // Configurações para Railway
  max: 20, // máximo de conexões
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// ===== EVENTOS DE CONEXÃO =====
pool.on("connect", (client) => {
  console.log("✅ Nova conexão PostgreSQL estabelecida")
})

pool.on("error", (err, client) => {
  console.error("❌ Erro inesperado no PostgreSQL:", err)
})

// ===== FUNÇÃO DE INICIALIZAÇÃO =====
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

    // Verificar se há dados
    const countResult = await client.query("SELECT COUNT(*) FROM coletas")
    const count = Number.parseInt(countResult.rows[0].count)

    console.log(`📊 Registros existentes: ${count}`)

    // Popular dados iniciais se vazio
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

    // Testar uma query simples
    const testResult = await client.query("SELECT dia_semana, tipo_coleta FROM coletas LIMIT 1")
    console.log("🧪 Teste de query:", testResult.rows[0])
  } catch (error) {
    console.error("❌ ERRO ao inicializar base de dados:", error)
    throw error
  } finally {
    client.release()
  }
}

// ===== FUNÇÃO DE TESTE =====
async function testConnection() {
  try {
    const client = await pool.connect()
    const result = await client.query("SELECT NOW()")
    client.release()
    console.log("✅ Teste de conexão OK:", result.rows[0].now)
    return true
  } catch (error) {
    console.error("❌ Teste de conexão falhou:", error)
    return false
  }
}

module.exports = { pool, initDatabase, testConnection }