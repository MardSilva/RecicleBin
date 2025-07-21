# ✅ PASSO 4: Teste Final

## 4.1 URLs Finais
- **Backend**: `https://seu-projeto.railway.app`
- **Frontend**: `https://seu-projeto.vercel.app`
- **API Health**: `https://seu-projeto.railway.app/health`

## 4.2 Checklist de Testes

### ✅ Backend
- [ ] Health check responde OK
- [ ] GET /api/semana retorna dados
- [ ] GET /api/dia/segunda-feira funciona
- [ ] PUT /api/dia/segunda-feira atualiza

### ✅ Frontend
- [ ] Página inicial carrega
- [ ] Mostra calendário da semana
- [ ] Destaca dia atual
- [ ] Página de detalhe funciona
- [ ] Edição salva corretamente

### ✅ Integração
- [ ] Frontend consome API corretamente
- [ ] CORS configurado
- [ ] Erros tratados adequadamente

## 4.3 Comandos de Teste

### Testar API diretamente:
\`\`\`bash
# Health check
curl https://sua-url.railway.app/health

# Buscar semana
curl https://sua-url.railway.app/api/semana

# Buscar dia específico
curl https://sua-url.railway.app/api/dia/segunda-feira

# Atualizar dia (POST)
curl -X PUT https://sua-url.railway.app/api/dia/segunda-feira \
  -H "Content-Type: application/json" \
  -d '{"tipo_coleta":"vidro","observacao":"teste"}'
\`\`\`

## 4.4 Monitoramento

### Railway Dashboard:
- **Metrics**: CPU, RAM, Network
- **Logs**: Erros e requests
- **Database**: Conexões e queries

### Vercel Dashboard:
- **Functions**: Execução e performance
- **Analytics**: Visitantes e páginas
- **Speed Insights**: Performance web
