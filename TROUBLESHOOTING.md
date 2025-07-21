# 🔧 Resolução de Problemas

## ❌ Problemas Comuns

### 1. "Cannot connect to database"
**Solução**:
- Verifique se PostgreSQL foi adicionado no Railway
- Confirme que DATABASE_URL está configurado
- Aguarde 2-3 minutos após criar o banco

### 2. "CORS error" no frontend
**Solução**:
- Confirme FRONTEND_URL no Railway
- Verifique se a URL do Vercel está correta
- Redeploy do backend após alterar CORS

### 3. "API_BASE_URL undefined"
**Solução**:
- Confirme variável no Vercel
- Redeploy do frontend
- Verifique se começa com NEXT_PUBLIC_

### 4. "Build failed" no Railway
**Solução**:
- Verifique package.json
- Confirme que "start" script existe
- Veja logs de build no Railway

### 5. "404 Not Found" nas rotas
**Solução**:
- Confirme estrutura de pastas
- Verifique se server.js está na raiz
- Confirme rota /health funciona

## 📞 Onde Buscar Ajuda

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Railway Discord**: https://discord.gg/railway
- **Stack Overflow**: Tag `railway` ou `vercel`

## 🔄 Comandos Úteis

### Logs em tempo real:
\`\`\`bash
# Railway CLI (opcional)
railway logs --follow

# Ou use o dashboard web
\`\`\`

### Reset completo:
1. Delete projeto Railway
2. Delete projeto Vercel  
3. Recrie tudo do zero
