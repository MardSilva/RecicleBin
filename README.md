# Frontend - Sistema de Coleta de Lixo - São João de Ver

Frontend da aplicação para gestão dos dias de coleta de lixo em São João de Ver, Portugal.

## 🚀 Tecnologias

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (ícones)

## 📋 Funcionalidades

- **Página Principal (`/`)**: Calendário semanal com destaque para o dia atual
- **Página de Detalhe (`/dia/[nome]`)**: Informações completas de um dia específico
- **Página de Edição (`/editar/[nome]`)**: Formulário para alterar tipos de coleta

## 🛠️ Instalação e Execução

### Desenvolvimento Local

1. Clone o repositório
2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente:
\`\`\`bash
cp .env.local.example .env.local
# Edite o arquivo .env.local com a URL da sua API
\`\`\`

4. Execute em modo desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

5. Acesse: http://localhost:3000

### Deploy no Vercel

1. Conecte seu repositório ao Vercel
2. Configure a variável de ambiente:
   - `NEXT_PUBLIC_API_BASE_URL`: URL da sua API backend

## 🔗 Configuração da API

O frontend consome dados de uma API REST. Configure a URL no arquivo `.env.local`:

\`\`\`env
# Desenvolvimento
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Produção
NEXT_PUBLIC_API_BASE_URL=https://sua-api.railway.app/api
\`\`\`

## 🎨 Interface

- Design responsivo para desktop e mobile
- Destaque visual para o dia atual
- Ícones e cores diferenciadas por tipo de resíduo
- Feedback visual para ações do utilizador
- Tratamento de erros de conexão

## 📱 Tipos de Coleta Suportados

- 🗑️ Orgânicos
- ♻️ Metal/Plástico  
- 📄 Papel/Cartão
- 🚫 Sem coleta
- 📦 Outros tipos personalizáveis
