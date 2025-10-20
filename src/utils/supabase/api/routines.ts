import { response } from "@/utils/entities/routineModel";
import { createClient } from "../client";

export async function ApiDeleteRoutine(idRoutine: string): Promise<response> {
  const supabase = createClient();

  const { error } = await supabase.from("routine").delete().eq("id", idRoutine);

  if (error) {
    return {
      code: 500,
      message: error.message,
    };
  }

  return {
    code: 200,
    message: "Rutina eliminada correctamente",
  };
}

export async function ApiSetTrackedRoutine(
  routineTrackedId: string,
  sets: number,
  reps: number,
  weight: number
): Promise<response> {
  const supabase = createClient();

  const { error } = await supabase.rpc("set_tracked_exercise", {
    p_routine_tracked_id: routineTrackedId,
    p_sets: sets,
    p_reps: reps,
    p_weight: weight,
  });

  if (error) {
    console.error("Error al registrar ejercicio:", error.message);
    return {
      code: 500,
      message: "Error al registrar ejercicio: " + error.message,
    };
  }

  return {
    code: 200,
    message: "Ejercicio registrado correctamente",
  };
}
