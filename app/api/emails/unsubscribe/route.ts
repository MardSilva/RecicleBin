import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/dataService"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Token de cancelamento não fornecido",
        },
        { status: 400 },
      )
    }

    const subscription = await dataService.unsubscribeByToken(token)

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: "Token inválido ou expirado",
        },
        { status: 404 },
      )
    }

    console.log(`📧 Subscrição cancelada: ${subscription.email}`)

    return NextResponse.json({
      success: true,
      message: "Subscrição cancelada com sucesso",
      email: subscription.email,
    })
  } catch (error) {
    console.error("❌ Erro ao cancelar subscrição:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
