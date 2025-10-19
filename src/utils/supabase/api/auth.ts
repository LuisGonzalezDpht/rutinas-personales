import {
  UserLoginResponse,
  UsersLogin,
  UsersSignUp,
} from "@/utils/entities/usersModel";
import { createClient } from "@/utils/supabase/client";
import ApiGetUser from "./user";

export async function ApiValidateLogin(): Promise<UserLoginResponse | null> {
  // Read remember-me preference to decide storage
  const rememberPref =
    typeof globalThis !== "undefined" && globalThis.localStorage
      ? globalThis.localStorage.getItem("remember_me")
      : null;
  const useLocal = rememberPref === "1";

  const supabase = createClient({
    storage: useLocal ? "local" : "session",
    persistSession: true,
    autoRefreshToken: true,
  });

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error(error);
    return null;
  }
  const session = data.session;
  if (!session || !session.user?.email) {
    return null;
  }

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

export async function ApiLogIn(
  { email, password }: UsersLogin,
  rememberMe?: boolean
): Promise<UserLoginResponse> {
  const supabase = createClient({
    storage: rememberMe ? "local" : "session",
    persistSession: true,
    autoRefreshToken: true,
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email!!,
    password: password!!,
  });

  if (error) {
    throw error;
  }

  if (typeof globalThis !== "undefined" && globalThis.localStorage) {
    globalThis.localStorage.setItem("remember_me", rememberMe ? "1" : "0");
  }

  await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });

  await supabase.auth.getSession();

  const userData = await ApiGetUser(data.user.email!!);

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

export async function ApiSignUp(user: UsersSignUp) {
  const supabase = createClient();

  const payload: any = {
    email: user.email,
    password: user.password,
    options: {
      data: {
        username: user.username,
        phone: user.phone,
      },
    },
  };

  const { data: signUpData, error } = await supabase.auth.signUp(payload);
  if (error) {
    throw error;
  }
  return signUpData;
}

export async function ApiLogOut() {
  // Try to sign out from both storage backends to ensure tokens are revoked
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

  try {
    await supabaseLocal.auth.signOut();
  } catch (e) {
    console.warn("signOut (local) failed", e);
  }
  try {
    await supabaseSession.auth.signOut();
  } catch (e) {
    console.warn("signOut (session) failed", e);
  }

  // Proactively clear stored tokens and remember-me to avoid auto re-login
  if (typeof window !== "undefined") {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const key = `sb-${supabaseUrl.replace(/^https?:\/\//, "")}-auth-token`;
      try {
        window.localStorage?.removeItem(key);
      } catch {}
      try {
        window.sessionStorage?.removeItem(key);
      } catch {}
    }
    try {
      window.localStorage?.removeItem("remember_me");
    } catch {}
  }
}

export async function ApiRecoverPassword(
  email: string,
  redirectTo?: string
): Promise<{ message: string; success: boolean }> {
  try {
    const supabase = createClient();

    const response = await ApiGetUser(email);
    if (!response) {
      return { message: "Email not found", success: false };
    }

    const url = redirectTo ?? `${process.env.NEXT_PUBLIC_SITE_URL}/recover`;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: url,
    });
    if (data) {
      return { message: "Password recovery email sent", success: true };
    }

    if (error) {
      return { message: error.message, success: false };
    }
    return { message: "Password recovery email sent", success: true };
  } catch (error) {
    return { message: "Error recovering password", success: false };
  }
}

export async function ApiResetPassword(
  code: string,
  email: string,
  password: string
): Promise<{ message: string; success: boolean }> {
  try {
    const supabase = createClient();

    if (!code) {
      return { message: "Code is required", success: false };
    }

    const responseCode = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: "recovery",
    });

    if (responseCode.error) {
      return { message: responseCode.error.message, success: false };
    }

    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });
    if (data) {
      return { message: "Password reset successfully", success: true };
    }

    if (error) {
      return { message: error.message, success: false };
    }
    return { message: "Password reset successfully", success: true };
  } catch (error) {
    return { message: "Error resetting password", success: false };
  }
}
