"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { api } from "@/lib/api"

interface ActionState {
  success: boolean
  message: string | null
}

export async function updateColetaAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const diaSemana = formData.get("dia_semana") as string
  const tipoColeta = formData.get("tipo_coleta") as string
  const observacao = formData.get("observacao") as string | null

  console.log(`[Server Action] Tentando atualizar coleta para: ${diaSemana}`)

  if (!diaSemana || !tipoColeta) {
    console.log("[Server Action] Erro: Dia da semana ou tipo de coleta ausente.")
    return { success: false, message: "Dia da semana e tipo de coleta são obrigatórios." }
  }

  try {
    await api.updateDia(diaSemana, tipoColeta, observacao || undefined)
    console.log(`[Server Action] Coleta atualizada no backend para: ${diaSemana}`)

    // Revalida o cache da página principal, da página de detalhes e da página de edição
    revalidatePath("/")
    revalidatePath(`/dia/${encodeURIComponent(diaSemana)}`)
    revalidatePath(`/editar/${encodeURIComponent(diaSemana)}`) // NOVO: Revalidar a página de edição
    console.log(`[Server Action] revalidatePath chamado para /, /dia/${diaSemana} e /editar/${diaSemana}`)

    redirect(`/dia/${encodeURIComponent(diaSemana)}`)
  } catch (err) {
    console.error("[Server Action] Erro ao atualizar coleta:", err)
    return { success: false, message: err instanceof Error ? err.message : "Erro ao atualizar coleta." }
  }
}
