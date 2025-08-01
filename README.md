# Sistema de Coleta de Lixo - São João de Ver

Sistema completo para gestão dos dias de coleta de lixo em São João de Ver, Portugal.

## 🚀 Funcionalidades

- **Calendário Semanal**: Visualização dos dias e tipos de coleta
- **Edição de Horários**: Interface para alterar tipos de coleta
- **Subscrição de Email**: Recebimento de calendário em PDF por email
- **Geração de PDF**: Calendário completo em formato PDF
- **Sistema de Cancelamento**: Links para cancelar subscrições

## 🛠️ Tecnologias

- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Puppeteer Core** (geração de PDF)
- **Nodemailer** (envio de emails)
- **JSON** (armazenamento de dados)

## 📦 Instalação Local

1. Clone o repositório:
   \`\`\`bash
   git clone https://github.com/MardSilva/RecicleBin.git
   cd RecicleBin
   \`\`\`

2. Instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`

3. Configure as variáveis de ambiente:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

4. Execute em desenvolvimento:
   \`\`\`bash
   npm run dev
   \`\`\`

## 🌐 Deploy no Vercel

### Método 1: Deploy Automático via GitHub

1. **Fork ou clone este repositório**
2. **Conecte ao Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório GitHub
   - Clique em "Deploy"

3. **Configure as variáveis de ambiente** no painel do Vercel:
   \`\`\`
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=seu-email@gmail.com
   EMAIL_PASS=sua-senha-de-app
   EMAIL_FROM=seu-email@gmail.com
   CONTACT_EMAIL=seu-email@gmail.com
   BASE_URL=https://seu-projeto.vercel.app
   \`\`\`

### Método 2: Deploy via CLI

1. **Instale a CLI do Vercel**:
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Faça login**:
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy**:
   \`\`\`bash
   vercel --prod
   \`\`\`

## 📧 Configuração de Email (Gmail)

1. **Ative a autenticação de 2 fatores** na sua conta Google
2. **Gere uma senha de app**:
   - Vá para [myaccount.google.com](https://myaccount.google.com)
   - Segurança → Verificação em duas etapas → Senhas de app
   - Gere uma senha para "Mail"
3. **Use a senha gerada** na variável `EMAIL_PASS`

## 📁 Estrutura do Projeto

\`\`\`
├── app/                    # Páginas e API routes (Next.js App Router)
│   ├── api/               # API Routes
│   ├── dia/               # Páginas de detalhes
│   ├── editar/            # Páginas de edição
│   └── unsubscribe/       # Página de cancelamento
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── *.tsx             # Componentes específicos
├── lib/                   # Serviços e utilitários
│   ├── dataService.ts    # Gerenciamento de dados JSON
│   ├── pdfService.ts     # Geração de PDF
│   ├── emailService.ts   # Envio de emails
│   └── api.ts            # Cliente da API
├── data/                  # Arquivos JSON (dados)
│   ├── coletas.json      # Dados das coletas
│   ├── email-subscriptions.json  # Subscrições
│   └── email-template.json       # Template de email
└── public/               # Arquivos estáticos
\`\`\`

## 🎯 Como Usar

### Para Administradores
1. **Visualizar Calendário**: Página principal mostra todos os dias
2. **Editar Coleta**: Clique no ícone de edição em qualquer dia
3. **Ver Detalhes**: Clique em "Ver detalhes" para informações completas

### Para Munícipes
1. **Consultar Horários**: Visualize o calendário na página principal
2. **Subscrever Email**: Insira seu email para receber o calendário em PDF
3. **Cancelar Subscrição**: Use o link recebido no email

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `EMAIL_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `EMAIL_PORT` | Porta SMTP | `587` |
| `EMAIL_USER` | Email do remetente | `seu-email@gmail.com` |
| `EMAIL_PASS` | Senha de app | `abcd efgh ijkl mnop` |
| `EMAIL_FROM` | Email "De" | `seu-email@gmail.com` |
| `CONTACT_EMAIL` | Email de contato | `seu-email@gmail.com` |
| `BASE_URL` | URL base da aplicação | `https://seu-projeto.vercel.app` |

## 🚀 Deploy Automático

O projeto está configurado para deploy automático no Vercel:
- ✅ **Push para main** → Deploy automático
- ✅ **Pull Request** → Preview deploy
- ✅ **Configuração otimizada** para produção
- ✅ **Puppeteer configurado** para Vercel

## 📝 Licença

MIT License - São João de Ver, Portugal

---

**Desenvolvido com ❤️ para a comunidade de São João de Ver**
