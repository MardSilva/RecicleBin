import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/dataService"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    console.log(`📧 Nova subscrição solicitada: ${email}`)

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          error: "Email inválido",
        },
        { status: 400 },
      )
    }

    const result = await dataService.addEmailSubscription(email)

    if (result.existing && result.subscription.is_active) {
      return NextResponse.json(
        {
          success: false,
          error: "Este email já está subscrito",
        },
        { status: 409 },
      )
    }

    console.log(`📧 ${result.existing ? "Subscrição reativada" : "Nova subscrição criada"}: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Email subscrito com sucesso! Receberá o calendário em breve.",
    })
  } catch (error) {
    console.error("❌ Erro ao subscrever email:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
