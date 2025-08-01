import puppeteer from "puppeteer-core"
import type { Coleta } from "./dataService"

export class PDFService {
  static async generateCalendarPDF(coletas: Coleta[]): Promise<Buffer> {
    let browser = null

    try {
      console.log("🔄 Iniciando geração de PDF...")

      // Configuração para Vercel
      const isProduction = process.env.NODE_ENV === "production"

      const puppeteerOptions = isProduction
        ? {
            args: [
              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-dev-shm-usage",
              "--disable-gpu",
              "--no-first-run",
              "--no-zygote",
              "--single-process",
            ],
            executablePath: "/usr/bin/google-chrome-stable",
            headless: true,
          }
        : {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
          }

      browser = await puppeteer.launch(puppeteerOptions)
      const page = await browser.newPage()

      const html = this.generateCalendarHTML(coletas)
      await page.setContent(html, { waitUntil: "networkidle0" })

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          right: "15mm",
          bottom: "20mm",
          left: "15mm",
        },
      })

      console.log("✅ PDF gerado com sucesso")
      return pdfBuffer
    } catch (error) {
      console.error("❌ Erro ao gerar PDF:", error)
      throw error
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }

  private static generateCalendarHTML(coletas: Coleta[]): string {
    const diasOrdenados = [
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
      "domingo",
    ]

    const coletasOrdenadas = diasOrdenados.map((dia) => coletas.find((c) => c.dia_semana === dia)).filter(Boolean)

    const getTipoIcon = (tipo: string) => {
      switch (tipo.toLowerCase()) {
        case "orgânicos":
          return "🗑️"
        case "metal/plástico":
          return "♻️"
        case "papel/cartão":
          return "📄"
        case "vidro":
          return "🍶"
        case "resíduos":
          return "🥬"
        case "sem coleta":
          return "🚫"
        default:
          return "📦"
      }
    }

    const getTipoColor = (tipo: string) => {
      switch (tipo.toLowerCase()) {
        case "orgânicos":
          return "#dcfce7"
        case "metal/plástico":
          return "#fef3c7"
        case "papel/cartão":
          return "#dbeafe"
        case "vidro":
          return "#d1fae5"
        case "resíduos":
          return "#fed7aa"
        case "sem coleta":
          return "#f3f4f6"
        default:
          return "#f3e8ff"
      }
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-PT">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Calendário de Coleta de Lixo - São João de Ver</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: #fff;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 10px;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .day-card {
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 20px;
                background: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .day-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 15px;
            }
            
            .day-name {
                font-size: 18px;
                font-weight: bold;
                text-transform: capitalize;
                color: #374151;
            }
            
            .day-icon {
                font-size: 24px;
            }
            
            .coleta-info {
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 10px;
                text-align: center;
            }
            
            .coleta-tipo {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 5px;
            }
            
            .observacao {
                font-size: 14px;
                color: #6b7280;
                font-style: italic;
                margin-top: 10px;
            }
            
            .footer {
                margin-top: 40px;
                padding: 20px;
                background: #f9fafb;
                border-radius: 10px;
                border-left: 4px solid #3b82f6;
            }
            
            .footer h3 {
                color: #1f2937;
                margin-bottom: 10px;
            }
            
            .footer ul {
                list-style: none;
                padding-left: 0;
            }
            
            .footer li {
                margin-bottom: 5px;
                font-size: 14px;
                color: #4b5563;
            }
            
            .footer li:before {
                content: "• ";
                color: #3b82f6;
                font-weight: bold;
            }
            
            .generated-date {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #9ca3af;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🗑️ Calendário de Coleta de Lixo</h1>
            <p>São João de Ver - Horários e tipos de coleta seletiva na freguesia</p>
        </div>
        
        <div class="calendar-grid">
            ${coletasOrdenadas
              .map(
                (coleta) => `
                <div class="day-card">
                    <div class="day-header">
                        <span class="day-name">${coleta!.dia_semana}</span>
                        <span class="day-icon">${getTipoIcon(coleta!.tipo_coleta)}</span>
                    </div>
                    <div class="coleta-info" style="background-color: ${getTipoColor(coleta!.tipo_coleta)}">
                        <div class="coleta-tipo">${coleta!.tipo_coleta}</div>
                    </div>
                    ${
                      coleta!.observacao
                        ? `<div class="observacao"><strong>Obs:</strong> ${coleta!.observacao}</div>`
                        : ""
                    }
                </div>
            `,
              )
              .join("")}
        </div>
        
        <div class="footer">
            <h3>📋 Informações Importantes</h3>
            <ul>
                <li>Coloque os contentores na rua até às 7h00</li>
                <li>Retire os contentores após a coleta</li>
                <li>Em caso de feriado, consulte as alterações</li>
                <li>Separe corretamente os resíduos por tipo</li>
                <li>Mantenha os contentores limpos e em bom estado</li>
            </ul>
        </div>
        
        <div class="generated-date">
            Documento gerado em ${new Date().toLocaleDateString("pt-PT", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
        </div>
    </body>
    </html>
    `
  }
}
