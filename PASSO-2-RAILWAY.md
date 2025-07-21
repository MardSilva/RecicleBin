# 🚂 PASSO 2: Deploy no Railway

## 2.1 Criar Conta e Projeto

1. **Acesse**: https://railway.app
2. **Clique**: "Start a New Project"
3. **Conecte**: sua conta GitHub
4. **Autorize**: Railway a acessar seus repositórios

## 2.2 Deploy do Backend

### Opção A: Deploy direto do GitHub
1. **Clique**: "Deploy from GitHub repo"
2. **Selecione**: seu repositório do backend
3. **Branch**: main (ou master)
4. **Root Directory**: deixe vazio se o backend está na raiz, ou coloque `backend/`

### Opção B: Criar repositório novo
Se ainda não tem no GitHub:
1. **Crie** repositório no GitHub
2. **Faça push** do código do backend
3. **Volte** ao Railway e selecione o repo

## 2.3 Adicionar PostgreSQL

1. **No dashboard** do seu projeto Railway
2. **Clique**: "Add Service" ou "+"
3. **Selecione**: "Database"
4. **Escolha**: "PostgreSQL"
5. **Aguarde**: provisioning (1-2 minutos)

## 2.4 Configurar Variáveis

1. **Clique** no serviço do backend (não no banco)
2. **Aba**: "Variables"
3. **Adicione**:
   \`\`\`
   NODE_ENV=production
   FRONTEND_URL=https://seu-frontend.vercel.app
   \`\`\`
4. **DATABASE_URL**: ✅ Já configurado automaticamente!
5. **PORT**: ✅ Já configurado automaticamente!

## 2.5 Verificar Deploy

1. **Aba**: "Deployments"
2. **Status**: Deve mostrar "Success" ✅
3. **Logs**: Verifique se não há erros
4. **URL**: Copie a URL pública (ex: `https://coleta-lixo-production.railway.app`)

## 2.6 Testar API

Teste no navegador:
\`\`\`
https://sua-url.railway.app/health
\`\`\`

Deve retornar:
\`\`\`json
{
  "status": "OK",
  "message": "API de Coleta de Lixo - São João de Ver",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "environment": "production"
}
