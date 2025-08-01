import { type NextRequest, NextResponse } from "next/server"
import { coletaDb } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { nome: string } }) {
  try {
    const diaSemana = decodeURIComponent(params.nome)
    const coleta = coletaDb.getDia(diaSemana)

    if (!coleta) {
      return NextResponse.json({ error: "Dia não encontrado" }, { status: 404 })
    }

    return NextResponse.json(coleta)
  } catch (error) {
    console.error("Erro ao buscar coleta do dia:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { nome: string } }) {
  try {
    const diaSemana = decodeURIComponent(params.nome)
    const body = await request.json()
    const { tipo_coleta, observacao } = body

    if (!tipo_coleta) {
      return NextResponse.json({ error: "Tipo de coleta é obrigatório" }, { status: 400 })
    }

    const success = coletaDb.updateDia(diaSemana, tipo_coleta, observacao)

    if (!success) {
      return NextResponse.json({ error: "Dia não encontrado" }, { status: 404 })
    }

    const coletaAtualizada = coletaDb.getDia(diaSemana)
    return NextResponse.json(coletaAtualizada)
  } catch (error) {
    console.error("Erro ao atualizar coleta:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
