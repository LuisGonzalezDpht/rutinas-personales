"use client";

import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/react";
import RootProvider from "@/context/RootProvider";
import useAuth from "@/store/auth";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = React.useState(false);

  // Espera la hidratación de Zustand persist
  React.useEffect(() => {
    const unsub = useAuth.persist?.onFinishHydration?.(() => setHydrated(true));
    if (useAuth.persist?.hasHydrated?.()) setHydrated(true);
    return () => unsub?.();
  }, []);

  // Manejo de rutas según autenticación
  React.useEffect(() => {
    if (!hydrated) return;

    const isPublicRoute =
      pathname.startsWith("/auth/") || pathname === "/recover";

    if (pathname === "/") {
      router.replace("/auth/login");
      return;
    }

    if (
      !auth.isAuthenticated &&
      pathname.startsWith("/user") &&
      !isPublicRoute
    ) {
      router.replace("/auth/login");
      return;
    }

    if (auth.isAuthenticated && pathname === "/auth/login") {
      router.replace("/user/home");
    }
  }, [hydrated, auth.isAuthenticated, pathname]);

  // Evita parpadeo antes de hidratar Zustand
  if (!hydrated) {
    return (
      <html lang="es" className="dark">
        <body className="flex items-center justify-center h-screen text-neutral-400"></body>
      </html>
    );
  }

  return (
    <html lang="es" className="dark">
      <body>
        <HeroUIProvider>
          <Toaster position="top-center" richColors closeButton />
          <RootProvider>{children}</RootProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
