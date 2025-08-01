-- Criar tabela coletas
CREATE TABLE IF NOT EXISTS coletas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dia_semana TEXT NOT NULL UNIQUE,
    tipo_coleta TEXT NOT NULL,
    observacao TEXT
);

-- Popular com dados iniciais (baseado em horários típicos de coleta em Portugal)
INSERT OR REPLACE INTO coletas (dia_semana, tipo_coleta, observacao) VALUES
('segunda-feira', 'orgânicos', NULL),
('terça-feira', 'metal/plástico', NULL),
('quarta-feira', 'orgânicos', NULL),
('quinta-feira', 'papel/cartão', NULL),
('sexta-feira', 'orgânicos', NULL),
('sábado', 'metal/plástico', NULL),
('domingo', 'sem coleta', NULL);
