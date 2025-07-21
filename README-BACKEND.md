# Backend - Sistema de Coleta de Lixo

## 🚀 Deploy no Railway

### Configuração Automática
O Railway configura automaticamente:
- ✅ `PORT` - Porta do servidor (geralmente 3001)
- ✅ `DATABASE_URL` - String de conexão PostgreSQL
- ✅ Build e deploy automático

### Variáveis que VOCÊ precisa configurar:
\`\`\`env
NODE_ENV=production
FRONTEND_URL=https://seu-frontend.vercel.app
\`\`\`

### Como encontrar suas URLs:
1. **Backend URL**: No dashboard Railway → "Deployments" → URL pública
2. **Database**: Configurado automaticamente, não precisa se preocupar

## 📊 Monitoramento
- **Health Check**: `GET /health`
- **Logs**: Disponíveis no dashboard Railway
- **Métricas**: CPU, RAM, requests no Railway

## 🔄 Deploy Automático
- Push para `main` → Deploy automático
- Rollback disponível no dashboard
- Zero downtime deployments
