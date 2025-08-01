import { NextResponse } from "next/server"
import { dataService } from "@/lib/dataService"
import { PDFService } from "@/lib/pdfService"
import { EmailService } from "@/lib/emailService"

export async function POST() {
  try {
    console.log("📧 Iniciando envio de calendários...")

    const coletas = await dataService.getColetas()

    if (coletas.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Nenhuma coleta encontrada",
        },
        { status: 404 },
      )
    }

    console.log("📄 Gerando PDF do calendário...")
    const pdfBuffer = await PDFService.generateCalendarPDF(coletas)

    const activeEmails = await dataService.getActiveEmails()

    if (activeEmails.length === 0) {
      return NextResponse.json({
        success: true,
        message: "PDF gerado, mas nenhum email subscrito encontrado",
        emailsSent: 0,
      })
    }

    console.log(`📧 Enviando para ${activeEmails.length} emails...`)

    const emailService = new EmailService()
    const results = []

    for (const email of activeEmails) {
      try {
        const result = await emailService.sendCalendarEmail(email, pdfBuffer)
        results.push({ email: email, success: true, messageId: result.messageId })

        await dataService.updateUnsubscribeToken(email, result.unsubscribeToken)
      } catch (error) {
        console.error(`❌ Erro ao enviar para ${email}:`, error)
        results.push({ email: email, success: false, error: (error as Error).message })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    console.log(`✅ Envio concluído: ${successCount} sucessos, ${failureCount} falhas`)

    return NextResponse.json({
      success: true,
      message: `Calendários enviados: ${successCount} sucessos, ${failureCount} falhas`,
      emailsSent: successCount,
      emailsFailed: failureCount,
      results: results,
    })
  } catch (error) {
    console.error("❌ Erro ao enviar calendários:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 },
    )
  }
}
