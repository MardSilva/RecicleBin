const express = require("express")
const { pool } = require("../database/connection")

const router = express.Router()

// ===== MIDDLEWARE DE LOG =====
router.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`)
  next()
})

// ===== GET /api/semana =====
router.get("/semana", async (req, res) => {
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

// ===== GET /api/dia/:nome =====
router.get("/dia/:nome", async (req, res) => {
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

// ===== PUT /api/dia/:nome =====
router.put("/dia/:nome", async (req, res) => {
  try {
    const diaSemana = decodeURIComponent(req.params.nome).toLowerCase()
    const { tipo_coleta, observacao } = req.body

    console.log(`🔄 Atualizando ${diaSemana}:`, { tipo_coleta, observacao })

    // Validação
    if (!tipo_coleta || tipo_coleta.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Tipo de coleta é obrigatório",
        received: { tipo_coleta, observacao },
      })
    }

    // Verificar se existe
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

    // Atualizar
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

module.exports = router