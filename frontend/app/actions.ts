"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { api } from "@/lib/api" // Certifique-se de que o caminho está correto

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

    // Revalida o cache da página principal e da página de detalhes do dia
    revalidatePath("/")
    revalidatePath(`/dia/${encodeURIComponent(diaSemana)}`)

    // Redireciona para a página de detalhes do dia após a atualização
    redirect(`/dia/${encodeURIComponent(diaSemana)}`)

    // Este return não será alcançado devido ao redirect, mas é bom para tipagem
    // return { success: true, message: 'Coleta atualizada com sucesso!' };
  } catch (err) {
    console.error("Erro no Server Action ao atualizar coleta:", err)
    return { success: false, message: err instanceof Error ? err.message : "Erro ao atualizar coleta." }
  }
}