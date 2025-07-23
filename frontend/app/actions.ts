"use server"

import { revalidatePath } from "next/cache"
import { api } from "@/lib/api"

interface ActionState {
  success: boolean
  message: string | null
}

export async function updateColetaAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const diaSemana = formData.get("dia_semana") as string
  const tipoColeta = formData.get("tipo_coleta") as string
  const observacao = formData.get("observacao") as string | null

  if (!diaSemana || !tipoColeta) {
    return { success: false, message: "Dia da semana e tipo de coleta são obrigatórios." }
  }

  try {
    await api.updateDia(diaSemana, tipoColeta, observacao || undefined)

    // Opcional: manter revalidações
    revalidatePath("/")
    revalidatePath(`/dia/${encodeURIComponent(diaSemana)}`)
    revalidatePath(`/editar/${encodeURIComponent(diaSemana)}`)

    return {
      success: true,
      message: "Coleta atualizada com sucesso.",
    }
  } catch (err) {
    console.error("[Server Action] Erro ao atualizar coleta:", err)
    return { success: false, message: "Erro ao atualizar coleta." }
  }
}
