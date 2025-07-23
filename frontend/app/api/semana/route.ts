import { NextResponse } from "next/server"
import { coletaDb } from "@/lib/database"

export async function GET() {
  try {
    const coletas = coletaDb.getSemana()
    return NextResponse.json(coletas)
  } catch (error) {
    console.error("Erro ao buscar coletas da semana:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
