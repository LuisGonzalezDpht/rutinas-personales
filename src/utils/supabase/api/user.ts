import { UserResponse } from "@/utils/entities/usersModel";
import { createClient } from "../client";

export default async function ApiGetUser(email: string): Promise<UserResponse> {
  const supabase = createClient();

  const { data: userData, error } = await supabase
    .from("users")
    .select("id, username, email, created_at, updated_at")
    .eq("email", email);

  if (error) {
    throw error;
  }

  return {
    ...userData[0],
    createdAt: new Date(userData[0].created_at),
    updatedAt: new Date(userData[0].updated_at),
  };
}
