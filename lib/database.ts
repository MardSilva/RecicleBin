import Database from "better-sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "coletas.db")
const db = new Database(dbPath)

// Criar tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS coletas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dia_semana TEXT NOT NULL UNIQUE,
    tipo_coleta TEXT NOT NULL,
    observacao TEXT
  )
`)

// Popular dados iniciais se a tabela estiver vazia
const count = db.prepare("SELECT COUNT(*) as count FROM coletas").get() as { count: number }
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO coletas (dia_semana, tipo_coleta, observacao) VALUES (?, ?, ?)
  `)

  const dadosIniciais = [
    ["segunda-feira", "orgânicos", null],
    ["terça-feira", "metal/plástico", null],
    ["quarta-feira", "orgânicos", null],
    ["quinta-feira", "papel/cartão", null],
    ["sexta-feira", "orgânicos", null],
    ["sábado", "metal/plástico", null],
    ["domingo", "sem coleta", null],
  ]

  dadosIniciais.forEach(([dia, tipo, obs]) => {
    insert.run(dia, tipo, obs)
  })
}

export interface Coleta {
  id: number
  dia_semana: string
  tipo_coleta: string
  observacao?: string
}

export const coletaDb = {
  // Buscar todas as coletas da semana
  getSemana: (): Coleta[] => {
    return db.prepare("SELECT * FROM coletas ORDER BY id").all() as Coleta[]
  },

  // Buscar coleta de um dia específico
  getDia: (diaSemana: string): Coleta | null => {
    return db.prepare("SELECT * FROM coletas WHERE dia_semana = ?").get(diaSemana) as Coleta | null
  },

  // Atualizar coleta de um dia
  updateDia: (diaSemana: string, tipoColeta: string, observacao?: string): boolean => {
    const result = db
      .prepare(`
      UPDATE coletas 
      SET tipo_coleta = ?, observacao = ? 
      WHERE dia_semana = ?
    `)
      .run(tipoColeta, observacao || null, diaSemana)

    return result.changes > 0
  },
}
