import nodemailer from "nodemailer"
import crypto from "crypto"
import { dataService } from "./dataService"

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: Number.parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  async sendCalendarEmail(email: string, pdfBuffer: Buffer) {
    const unsubscribeToken = crypto.randomBytes(32).toString("hex")
    const unsubscribeUrl = `${process.env.BASE_URL || "http://localhost:3000"}/unsubscribe?token=${unsubscribeToken}`

    const template = await dataService.getEmailTemplate()

    const mailOptions = {
      from: {
        name: "Sistema de Coleta - São João de Ver",
        address: process.env.EMAIL_FROM!,
      },
      to: email,
      subject: template.subject,
      html: this.generateEmailHTML(template, unsubscribeUrl),
      attachments: [
        {
          filename: `calendario-coleta-sao-joao-ver-${new Date().toISOString().split("T")[0]}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    }

    try {
      const result = await this.transporter.sendMail(mailOptions)
      console.log(`✅ Email enviado para ${email}:`, result.messageId)
      return { success: true, messageId: result.messageId, unsubscribeToken }
    } catch (error) {
      console.error(`❌ Erro ao enviar email para ${email}:`, error)
      throw error
    }
  }

  private generateEmailHTML(template: any, unsubscribeUrl: string): string {
    const featuresHTML = template.features.map((feature: string) => `<li>${feature}</li>`).join("")

    const unsubscribeMessage = template.unsubscribe_message.replace(
      "{CONTACT_EMAIL}",
      `<strong>${process.env.CONTACT_EMAIL}</strong>`,
    )

    return `
    <!DOCTYPE html>
    <html lang="pt-PT">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Calendário de Coleta de Lixo</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 8px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                margin-bottom: 30px;
            }
            .content p {
                margin-bottom: 15px;
                font-size: 16px;
            }
            .highlight {
                background-color: #e0f2fe;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #0284c7;
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 14px;
                color: #6b7280;
            }
            .unsubscribe {
                margin-top: 20px;
                padding: 15px;
                background-color: #fef3c7;
                border-radius: 8px;
                border-left: 4px solid #f59e0b;
            }
            .unsubscribe a {
                color: #d97706;
                text-decoration: none;
                font-weight: 600;
            }
            .unsubscribe a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🗑️ Calendário de Coleta de Lixo</h1>
                <p>São João de Ver</p>
            </div>
            
            <div class="content">
                <p>${template.greeting}</p>
                
                <p>${template.main_message}</p>
                
                <div class="highlight">
                    <p><strong>📎 ${template.pdf_description}</strong></p>
                </div>
                
                <p>Este documento contém todas as informações necessárias sobre:</p>
                <ul>
                    ${featuresHTML}
                </ul>
                
                <p>${template.closing_message}</p>
                
                <p>Com os melhores cumprimentos,<br>
                <strong>${template.signature}</strong></p>
            </div>
            
            <div class="unsubscribe">
                <p><strong>⚠️ Gestão de Subscrição:</strong></p>
                <p>${unsubscribeMessage} ou <a href="${unsubscribeUrl}">clique aqui para cancelar a subscrição</a>.</p>
            </div>
            
            <div class="footer">
                <p>${template.footer_message}</p>
                <p>Para questões ou sugestões, contacte: ${process.env.CONTACT_EMAIL}</p>
            </div>
        </div>
    </body>
    </html>
    `
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      console.log("✅ Conexão com servidor de email verificada")
      return true
    } catch (error) {
      console.error("❌ Erro na conexão com servidor de email:", error)
      return false
    }
  }
}
