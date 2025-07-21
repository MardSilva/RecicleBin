# 🚀 Guia de Deploy - Sistema de Coleta de Lixo

## Arquitetura Recomendada

\`\`\`
GitHub (código) → Railway (backend + PostgreSQL) → Vercel (frontend)
\`\`\`

## 📋 Passo a Passo

### 1. Backend no Railway

1. **Acesse**: https://railway.app
2. **Conecte** seu GitHub
3. **Crie novo projeto** → "Deploy from GitHub repo"
4. **Selecione** o repositório do backend
5. **Adicione PostgreSQL**:
   - No dashboard → "Add Service" → "Database" → "PostgreSQL"
6. **Variáveis automáticas**:
   - `DATABASE_URL` (criada automaticamente)
   - `PORT` (criada automaticamente pelo Railway)

### 2. Configurar Variáveis no Railway

\`\`\`env
# Estas são criadas AUTOMATICAMENTE pelo Railway:
DATABASE_URL=postgresql://...  # ✅ Automático
PORT=3001                      # ✅ Automático

# Você só precisa adicionar:
NODE_ENV=production
FRONTEND_URL=https://seu-frontend.vercel.app
\`\`\`

### 3. Frontend no Vercel

1. **Conecte** repositório do frontend
2. **Configure** variável:
   \`\`\`env
   NEXT_PUBLIC_API_BASE_URL=https://seu-backend.railway.app/api
   \`\`\`

## 🔧 URLs Finais

- **Backend**: `https://seu-projeto.railway.app`
- **Frontend**: `https://seu-projeto.vercel.app`
- **Banco**: Interno no Railway (não precisa se preocupar)
