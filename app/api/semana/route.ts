import { NextResponse } from "next/server"
import { dataService } from "@/lib/dataService"

export async function GET() {
  try {
    console.log("🔍 Buscando coletas da semana...")

    const coletas = await dataService.getColetas()

    const diasOrdem = [
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
      "domingo",
    ]
    const coletasOrdenadas = coletas.sort((a, b) => {
      return diasOrdem.indexOf(a.dia_semana) - diasOrdem.indexOf(b.dia_semana)
    })

    console.log(`✅ Encontrados ${coletasOrdenadas.length} registros`)

    return NextResponse.json({
      success: true,
      data: coletasOrdenadas,
      total: coletasOrdenadas.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Erro ao buscar semana:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar coletas da semana",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 },
    )
  }
}
