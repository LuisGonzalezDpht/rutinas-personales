import { response } from "@/utils/entities/routineModel";
import { createClient } from "../client";

export default async function ApiDeleteRoutine(
  idRoutine: string
): Promise<response> {
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
