import {
  UserLoginResponse,
  UsersLogin,
  UsersSignUp,
} from "@/utils/entities/usersModel";
import { createClient } from "@/utils/supabase/client";
import ApiGetUser from "./user";

/**
 * Valida si hay sesión activa según la preferencia remember_me.
 */
export async function ApiValidateLogin(): Promise<UserLoginResponse | null> {
  const rememberPref =
    typeof window !== "undefined"
      ? window.localStorage.getItem("remember_me")
      : null;
  const useLocal = rememberPref === "1";

  const supabase = createClient({
    storage: useLocal ? "local" : "session",
    persistSession: true,
    autoRefreshToken: true,
  });

  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session?.user?.email) return null;

  const userData = await ApiGetUser(session.user.email);
  return {
    user: userData,
    session: {
      access_token: session.access_token,
      expires_in: session.expires_in,
      expires_at: session.expires_at,
      refresh_token: session.refresh_token,
      token_type: session.token_type,
    },
  };
}

/**
 * Inicia sesión en Supabase y guarda la preferencia de recordarme.
 */
export async function ApiLogIn(
  { email, password }: UsersLogin,
  rememberMe?: boolean
): Promise<UserLoginResponse> {
  if (!email || !password) throw new Error("Email and password are required");

  const supabase = createClient({
    storage: rememberMe ? "local" : "session",
    persistSession: true,
    autoRefreshToken: true,
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  // Guarda preferencia de recordarme
  if (typeof window !== "undefined") {
    window.localStorage.setItem("remember_me", rememberMe ? "1" : "0");
  }

  const userEmail = data.user?.email;
  if (!userEmail) throw new Error("Missing user email after login");

  const userData = await ApiGetUser(userEmail);

  return {
    user: userData,
    session: {
      access_token: data.session.access_token,
      expires_in: data.session.expires_in,
      expires_at: data.session.expires_at,
      refresh_token: data.session.refresh_token,
      token_type: data.session.token_type,
    },
  };
}

/**
 * Registra un nuevo usuario en Supabase.
 */
export async function ApiSignUp(user: UsersSignUp) {
  const { email, password, username, phone } = user;
  if (!email || !password) throw new Error("Email and password are required");

  const supabase = createClient();
  const metadata: Record<string, string> = {};
  if (username) metadata.username = username;
  if (phone) metadata.phone = phone;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  if (error) throw error;
  return data;
}

/**
 * Cierra sesión y limpia todas las sesiones persistentes.
 */
export async function ApiLogOut() {
  const supabaseLocal = createClient({
    storage: "local",
    persistSession: true,
    autoRefreshToken: true,
  });
  const supabaseSession = createClient({
    storage: "session",
    persistSession: true,
    autoRefreshToken: true,
  });

  await Promise.allSettled([
    supabaseLocal.auth.signOut(),
    supabaseSession.auth.signOut(),
  ]);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem("remember_me");
    } catch {}
  }
}

/**
 * Envía correo de recuperación de contraseña.
 */
export async function ApiRecoverPassword(
  email: string,
  redirectTo?: string
): Promise<{ message: string; success: boolean }> {
  try {
    const supabase = createClient();

    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL ?? "";

    const url = redirectTo ?? `${baseUrl}/auth/recover`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: url,
    });

    if (error) return { message: error.message, success: false };

    return { message: "Password recovery email sent", success: true };
  } catch (err) {
    console.error(err);
    return { message: "Error recovering password", success: false };
  }
}

/**
 * Restablece la contraseña del usuario usando código OTP recibido por correo.
 */
export async function ApiResetPassword(
  code: string,
  email: string,
  password: string
): Promise<{ message: string; success: boolean }> {
  try {
    if (!code) return { message: "Code is required", success: false };

    const supabase = createClient();

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "recovery",
    });
    if (verifyError) return { message: verifyError.message, success: false };

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    if (updateError) return { message: updateError.message, success: false };

    return { message: "Password reset successfully", success: true };
  } catch (err) {
    console.error(err);
    return { message: "Error resetting password", success: false };
  }
}
