export interface Exercises {
  id: string;
  name: string;
  muscle_area_id: number;
  description: string;
  createdAt: Date;
}

export interface MuscleAreas {
  id: number;
  name: string;
}
