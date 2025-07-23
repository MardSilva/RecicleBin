const { Pool } = require("pg")

// Configuração do banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Testar conexão
pool.on("connect", () => {
  console.log("✅ Conectado ao PostgreSQL")
})

pool.on("error", (err) => {
  console.error("❌ Erro na conexão PostgreSQL:", err)
})

async function initDatabase() {
  try {
    console.log("🔄 Criando tabela coletas...")

    // Criar tabela
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coletas (
        id SERIAL PRIMARY KEY,
        dia_semana VARCHAR(20) NOT NULL UNIQUE,
        tipo_coleta VARCHAR(50) NOT NULL,
        observacao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Verificar dados
    const result = await pool.query("SELECT COUNT(*) FROM coletas")
    const count = Number.parseInt(result.rows[0].count)

    if (count === 0) {
      console.log("🔄 Inserindo dados iniciais...")

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
        await pool.query("INSERT INTO coletas (dia_semana, tipo_coleta) VALUES ($1, $2)", [dia, tipo])
      }

      console.log("✅ Dados iniciais inseridos")
    } else {
      console.log(`✅ Tabela já possui ${count} registros`)
    }
  } catch (error) {
    console.error("❌ Erro ao inicializar base de dados:", error)
    throw error
  }
}

module.exports = { pool, initDatabase }
