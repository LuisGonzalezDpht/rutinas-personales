import {
  routineRequest,
  response,
  routineReponse,
  responseData,
} from "@/utils/entities/routineModel";
import { createClient } from "../client";

export async function RpcCreateRoutine(
  routine: routineRequest
): Promise<response> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("create_routine_with_exercises", {
    p_name: routine.p_name,
    p_day_of_week: routine.p_day_of_week,
    p_user_id: routine.p_user_id,
    p_exercises: routine.p_exercises,
  });

  const errorMessage = {
    code: 500,
    message: error?.message || "Error al crear la rutina",
  };

  if (error) {
    return errorMessage;
  }

  if (data) {
    return {
      code: 200,
      message: "Rutina creada con éxito",
    };
  }

  return errorMessage;
}

export async function RpcGetRoutines(
  userId: string,
  dayOfWeek: boolean | null = null,
  filterThisWeek: boolean | null = null
): Promise<routineReponse[] | response> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "get_user_routines_with_exercises",
    {
      p_user_id: userId,
      p_order_by_day_of_week: dayOfWeek || false,
      p_only_this_week: filterThisWeek || false,
    }
  );

  const errorMessage = {
    code: 500,
    message: error?.message || "Error al obtener las rutinas",
  };

  if (error) {
    return errorMessage;
  }

  return data;
}

export async function RpcGetRoutinesByDay(
  userId: string,
  dayOfWeek: string
): Promise<routineReponse[] | response> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "get_user_routines_with_exercises_with_filter",
    {
      p_user_id: userId,
      p_key: "day_of_week",
      p_value: dayOfWeek,
    }
  );

  const errorMessage = {
    code: 500,
    message: error?.message || "Error al obtener las rutinas",
  };

  if (error) {
    return errorMessage;
  }

  return data;
}

export async function RpcGetRoutineChartData(
  p_routine_id: string,
  p_metric: string,
  p_range: string
): Promise<responseData> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_user_metric_series", {
    p_routine_id: p_routine_id,
    p_metric: p_metric,
    p_range: p_range,
  });

  const errorMessage = {
    code: 500,
    message: error?.message || "Error al obtener los datos de la rutina",
  };

  if (error) {
    return errorMessage;
  }

  return {
    code: 200,
    message: "Datos de la rutina obtenidos con éxito",
    data: data,
  };
}
