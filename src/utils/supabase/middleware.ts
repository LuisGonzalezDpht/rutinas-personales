import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      async getAll() {
        return (await request.cookies).getAll();
      },
      async setAll(cookiesToSet) {
        try {
          await cookiesToSet.forEach(async ({ name, value, options }) =>
            (await request.cookies).set({ name, value, ...options })
          );
        } catch {}
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(async ({ name, value, options }) =>
          (await supabaseResponse.cookies).set({ name, value, ...options })
        );
      },
    },
  });

  return { supabaseResponse, supabase };
};
