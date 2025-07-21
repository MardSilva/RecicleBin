## 3.2 Deploy no Vercel

1. **Acesse**: https://vercel.com
2. **Conecte**: GitHub
3. **Import Project**: selecione repositório do frontend
4. **Configure**:
   - Framework Preset: Next.js ✅
   - Root Directory: `frontend/` (se aplicável)
   - Build Command: `npm run build` ✅
   - Output Directory: `.next` ✅

## 3.3 Configurar Variável de Ambiente

1. **Projeto** → **Settings** → **Environment Variables**
2. **Adicione**:
   \`\`\`
   Name: NEXT_PUBLIC_API_BASE_URL
   Value: https://sua-url.railway.app/api
   \`\`\`
3. **Environments**: Production, Preview, Development
4. **Save**

## 3.4 Redeploy

1. **Deployments** → **...** → **Redeploy**
2. **Aguarde** o build
3. **Teste** a URL do Vercel

## 3.5 Atualizar CORS no Backend

1. **Volte** ao Railway
2. **Variables** → **FRONTEND_URL**
3. **Atualize** com a URL do Vercel:
   \`\`\`
   FRONTEND_URL=https://seu-projeto.vercel.app
   \`\`\`
4. **Deploy** será automático
