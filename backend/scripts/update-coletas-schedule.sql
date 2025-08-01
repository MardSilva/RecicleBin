-- Script para atualizar o calendário de coletas com base no calendário de Santa Maria da Feira

-- Atualizar segunda-feira para coleta de vidro
UPDATE coletas
SET tipo_coleta = 'vidro', observacao = NULL, updated_at = CURRENT_TIMESTAMP
WHERE dia_semana = 'segunda-feira';

-- Atualizar quinta-feira para coleta de metal/plástico
UPDATE coletas
SET tipo_coleta = 'metal/plástico', observacao = NULL, updated_at = CURRENT_TIMESTAMP
WHERE dia_semana = 'quinta-feira';

-- Atualizar sexta-feira para coleta de papel/cartão
UPDATE coletas
SET tipo_coleta = 'papel/cartão', observacao = NULL, updated_at = CURRENT_TIMESTAMP
WHERE dia_semana = 'sexta-feira';

-- Atualizar sábado para sem coleta com observação específica
UPDATE coletas
SET tipo_coleta = 'sem coleta', observacao = 'Sem coleta definida pelo calendário de Sta. Maria da Feira', updated_at = CURRENT_TIMESTAMP
WHERE dia_semana = 'sábado';

-- Atualizar domingo para sem coleta com observação específica
UPDATE coletas
SET tipo_coleta = 'sem coleta', observacao = 'Sem coleta definida pelo calendário de Sta. Maria da Feira', updated_at = CURRENT_TIMESTAMP
WHERE dia_semana = 'domingo';

-- Opcional: Selecionar todos os dados para verificar as alterações
-- SELECT * FROM coletas ORDER BY
--   CASE dia_semana
--     WHEN 'segunda-feira' THEN 1
--     WHEN 'terça-feira' THEN 2
--     WHEN 'quarta-feira' THEN 3
--     WHEN 'quinta-feira' THEN 4
--     WHEN 'sexta-feira' THEN 5
--     WHEN 'sábado' THEN 6
--     WHEN 'domingo' THEN 7
--   END;
