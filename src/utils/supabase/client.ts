import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type SupabaseClientOptions = {
  storage?: "local" | "session";
  persistSession?: boolean;
  autoRefreshToken?: boolean;
};

export const createClient = (options?: SupabaseClientOptions) =>
  createBrowserClient(supabaseUrl!, supabaseKey!, {
    auth: {
      persistSession: options?.persistSession ?? true,
      autoRefreshToken: options?.autoRefreshToken ?? true,
      storage:
        options?.storage === "session"
          ? typeof globalThis !== "undefined"
            ? globalThis.sessionStorage
            : undefined
          : typeof globalThis !== "undefined"
          ? globalThis.localStorage
          : undefined,
    },
  });
