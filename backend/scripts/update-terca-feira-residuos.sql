-- Script para atualizar a terça-feira para coleta de "resíduos" (alimentares e verdes)

UPDATE coletas
SET
    tipo_coleta = 'resíduos',
    observacao = 'Inclui resíduos alimentares e resíduos verdes (relvas, adubo, terras de plantas e etc.)',
    updated_at = CURRENT_TIMESTAMP
WHERE dia_semana = 'terça-feira';

-- Opcional: Selecionar os dados da terça-feira para verificar a alteração
-- SELECT * FROM coletas WHERE dia_semana = 'terça-feira';
