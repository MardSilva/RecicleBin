const fs = require("fs").promises
const path = require("path")
const crypto = require("crypto")

class DataService {
  constructor() {
    this.dataDir = path.join(__dirname, "..", "data")
    this.coletasFile = path.join(this.dataDir, "coletas.json")
    this.emailsFile = path.join(this.dataDir, "email-subscriptions.json")
    this.templateFile = path.join(this.dataDir, "email-template.json")
  }

  // ===== MÉTODOS AUXILIARES =====
  async ensureDataDirectory() {
    try {
      await fs.access(this.dataDir)
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true })
      console.log("📁 Diretório de dados criado")
    }
  }

  async readJSONFile(filePath, defaultData = {}) {
    try {
      const data = await fs.readFile(filePath, "utf8")
      return JSON.parse(data)
    } catch (error) {
      if (error.code === "ENOENT") {
        // Arquivo não existe, criar com dados padrão
        await this.writeJSONFile(filePath, defaultData)
        return defaultData
      }
      throw error
    }
  }

  async writeJSONFile(filePath, data) {
    await this.ensureDataDirectory()
    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, jsonData, "utf8")
  }

  // ===== MÉTODOS DE COLETAS =====
  async getColetas() {
    const defaultData = {
      coletas: [
        {
          id: 1,
          dia_semana: "segunda-feira",
          tipo_coleta: "vidro",
          observacao: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          dia_semana: "terça-feira",
          tipo_coleta: "resíduos",
          observacao: "Inclui resíduos alimentares e resíduos verdes (relvas, adubo, terras de plantas e etc.)",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 3,
          dia_semana: "quarta-feira",
          tipo_coleta: "orgânicos",
          observacao: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 4,
          dia_semana: "quinta-feira",
          tipo_coleta: "metal/plástico",
          observacao: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 5,
          dia_semana: "sexta-feira",
          tipo_coleta: "papel/cartão",
          observacao: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 6,
          dia_semana: "sábado",
          tipo_coleta: "sem coleta",
          observacao: "Sem coleta definida pelo calendário de Sta. Maria da Feira",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 7,
          dia_semana: "domingo",
          tipo_coleta: "sem coleta",
          observacao: "Sem coleta definida pelo calendário de Sta. Maria da Feira",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      metadata: {
        last_updated: new Date().toISOString(),
        version: "1.0.0",
      },
    }

    const data = await this.readJSONFile(this.coletasFile, defaultData)
    return data.coletas
  }

  async getColetaByDia(diaSemana) {
    const coletas = await this.getColetas()
    return coletas.find((c) => c.dia_semana.toLowerCase() === diaSemana.toLowerCase()) || null
  }

  async updateColeta(diaSemana, tipoColeta, observacao) {
    const data = await this.readJSONFile(this.coletasFile)
    const coletaIndex = data.coletas.findIndex((c) => c.dia_semana.toLowerCase() === diaSemana.toLowerCase())

    if (coletaIndex === -1) {
      return null
    }

    data.coletas[coletaIndex].tipo_coleta = tipoColeta
    data.coletas[coletaIndex].observacao = observacao || null
    data.coletas[coletaIndex].updated_at = new Date().toISOString()
    data.metadata.last_updated = new Date().toISOString()

    await this.writeJSONFile(this.coletasFile, data)
    return data.coletas[coletaIndex]
  }

  // ===== MÉTODOS DE EMAIL =====
  async getEmailSubscriptions() {
    const defaultData = {
      subscriptions: [],
      metadata: {
        total_subscriptions: 0,
        active_subscriptions: 0,
        last_updated: new Date().toISOString(),
        version: "1.0.0",
      },
    }

    return await this.readJSONFile(this.emailsFile, defaultData)
  }

  async addEmailSubscription(email) {
    const data = await this.getEmailSubscriptions()
    const existingIndex = data.subscriptions.findIndex((s) => s.email === email)

    if (existingIndex !== -1) {
      // Reativar se existir
      if (!data.subscriptions[existingIndex].is_active) {
        data.subscriptions[existingIndex].is_active = true
        data.subscriptions[existingIndex].unsubscribe_token = crypto.randomBytes(32).toString("hex")
      }
      return { existing: true, subscription: data.subscriptions[existingIndex] }
    }

    // Criar nova subscrição
    const newSubscription = {
      id: data.subscriptions.length + 1,
      email: email,
      subscribed_at: new Date().toISOString(),
      is_active: true,
      unsubscribe_token: crypto.randomBytes(32).toString("hex"),
    }

    data.subscriptions.push(newSubscription)
    data.metadata.total_subscriptions = data.subscriptions.length
    data.metadata.active_subscriptions = data.subscriptions.filter((s) => s.is_active).length
    data.metadata.last_updated = new Date().toISOString()

    await this.writeJSONFile(this.emailsFile, data)
    return { existing: false, subscription: newSubscription }
  }

  async getActiveEmails() {
    const data = await this.getEmailSubscriptions()
    return data.subscriptions.filter((s) => s.is_active).map((s) => s.email)
  }

  async unsubscribeByToken(token) {
    const data = await this.getEmailSubscriptions()
    const subscriptionIndex = data.subscriptions.findIndex((s) => s.unsubscribe_token === token)

    if (subscriptionIndex === -1) {
      return null
    }

    data.subscriptions[subscriptionIndex].is_active = false
    data.metadata.active_subscriptions = data.subscriptions.filter((s) => s.is_active).length
    data.metadata.last_updated = new Date().toISOString()

    await this.writeJSONFile(this.emailsFile, data)
    return data.subscriptions[subscriptionIndex]
  }

  async updateUnsubscribeToken(email, token) {
    const data = await this.getEmailSubscriptions()
    const subscriptionIndex = data.subscriptions.findIndex((s) => s.email === email && s.is_active)

    if (subscriptionIndex !== -1) {
      data.subscriptions[subscriptionIndex].unsubscribe_token = token
      await this.writeJSONFile(this.emailsFile, data)
    }
  }

  async getEmailStats() {
    const data = await this.getEmailSubscriptions()
    return {
      activeSubscriptions: data.subscriptions.filter((s) => s.is_active).length,
      totalSubscriptions: data.subscriptions.length,
      inactiveSubscriptions: data.subscriptions.filter((s) => !s.is_active).length,
    }
  }

  // ===== MÉTODOS DE TEMPLATE DE EMAIL =====
  async getEmailTemplate() {
    const defaultTemplate = {
      template: {
        subject: "📅 Calendário de Coleta de Lixo - São João de Ver",
        greeting: "Caro(a) munícipe,",
        main_message:
          "Agradecemos por ter fornecido o seu endereço de email para receber o calendário de coleta de lixo de São João de Ver.",
        pdf_description:
          "Em anexo encontrará o PDF com o calendário completo dos dias e tipos de coleta seletiva na nossa freguesia, que tivemos o prazer de montar e enviar especialmente para si.",
        features: [
          "📅 Dias da semana para cada tipo de coleta",
          "♻️ Tipos de resíduos (orgânicos, metal/plástico, papel/cartão, etc.)",
          "⏰ Horários e instruções importantes",
          "📋 Observações especiais e alterações",
        ],
        closing_message:
          "Esperamos que esta informação seja útil para si e contribua para uma melhor gestão dos resíduos na nossa comunidade.",
        signature: "Sistema de Coleta de Lixo - São João de Ver",
        unsubscribe_message:
          "Este é um serviço de informação sobre coleta de lixo. Se desejar ser removido(a) da nossa lista de envios, por favor entre em contacto connosco através do email {CONTACT_EMAIL} ou clique aqui para cancelar a subscrição.",
        footer_message: "Este email foi enviado automaticamente pelo Sistema de Coleta de Lixo de São João de Ver.",
      },
      metadata: {
        last_updated: new Date().toISOString(),
        version: "1.0.0",
      },
    }

    const data = await this.readJSONFile(this.templateFile, defaultTemplate)
    return data.template
  }
}

module.exports = new DataService()
