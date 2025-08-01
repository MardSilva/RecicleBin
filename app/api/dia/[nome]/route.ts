import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/dataService"

export async function GET(request: NextRequest, { params }: { params: { nome: string } }) {
  try {
    const diaSemana = decodeURIComponent(params.nome).toLowerCase()
    console.log(`🔍 Buscando coleta para: ${diaSemana}`)

    const coleta = await dataService.getColetaByDia(diaSemana)

    if (!coleta) {
      console.log(`❌ Dia não encontrado: ${diaSemana}`)
      return NextResponse.json(
        {
          success: false,
          error: "Dia da semana não encontrado",
          availableDays: [
            "segunda-feira",
            "terça-feira",
            "quarta-feira",
            "quinta-feira",
            "sexta-feira",
            "sábado",
            "domingo",
          ],
        },
        { status: 404 },
      )
    }

    console.log(`✅ Encontrado: ${coleta.dia_semana} - ${coleta.tipo_coleta}`)

    return NextResponse.json({
      success: true,
      data: coleta,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Erro ao buscar dia:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar coleta do dia",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { nome: string } }) {
  try {
    const diaSemana = decodeURIComponent(params.nome).toLowerCase()
    const body = await request.json()
    const { tipo_coleta, observacao } = body

    console.log(`🔄 Atualizando ${diaSemana}:`, { tipo_coleta, observacao })

    if (!tipo_coleta || tipo_coleta.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Tipo de coleta é obrigatório",
          received: { tipo_coleta, observacao },
        },
        { status: 400 },
      )
    }

    const coletaAtualizada = await dataService.updateColeta(diaSemana, tipo_coleta.trim(), observacao?.trim())

    if (!coletaAtualizada) {
      return NextResponse.json(
        {
          success: false,
          error: "Dia da semana não encontrado",
          availableDays: [
            "segunda-feira",
            "terça-feira",
            "quarta-feira",
            "quinta-feira",
            "sexta-feira",
            "sábado",
            "domingo",
          ],
        },
        { status: 404 },
      )
    }

    console.log(`✅ Atualizado com sucesso: ${coletaAtualizada.dia_semana}`)

    return NextResponse.json({
      success: true,
      message: "Coleta atualizada com sucesso",
      data: coletaAtualizada,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Erro ao atualizar:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao atualizar coleta",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 },
    )
  }
}
