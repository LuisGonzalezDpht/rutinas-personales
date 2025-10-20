import { dayOfWeek } from "@/shared/constants/Days";

export interface routineRequest {
  p_name: string;
  p_day_of_week: dayOfWeek;
  p_user_id: string;
  p_exercises: exerciseRequest[];
}

export interface exerciseRequest {
  name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  description: string;
}

export interface response {
  code: number;
  message: string;
}

export interface responseData extends response {
  data?: any;
}

export interface routineReponse {
  id: string;
  name: string;
  day_of_week: dayOfWeek;
  created_at: Date;
  updated_at: Date;
  exercises: exerciseResponse[];
}

export interface exerciseResponse extends exerciseRequest {
  id: string;
}
