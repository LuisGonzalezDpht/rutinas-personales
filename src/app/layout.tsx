"use client";

import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/react";
import RootProvider from "@/context/RootProvider";
import useAuth from "@/store/auth";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Espera a que zustand persist termine de hidratar
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    // establece estado inicial
    setHydrated(useAuth.persist?.hasHydrated?.() ?? false);
    // y luego escucha final de hidratación
    const unsubFinish = useAuth.persist?.onFinishHydration?.(() => {
      setHydrated(true);
    });
    return () => {
      unsubFinish?.();
    };
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;

    if (pathname === "/") {
      router.replace("/auth/login");
      return;
    }

    const isPublicRoute =
      pathname === "/auth/login" ||
      pathname === "/recover" ||
      pathname.startsWith("/auth/");

    if (
      !auth.isAuthenticated &&
      pathname.startsWith("/user") &&
      !isPublicRoute
    ) {
      router.replace("/auth/login");
      return;
    }

    // Si está autenticado y está en la pantalla de login, llévalo al home
    if (auth.isAuthenticated && pathname === "/auth/login") {
      router.replace("/user/home");
    }
  }, [hydrated, auth.isAuthenticated, pathname]);

  return (
    <html lang="es" className="dark">
      <body>
        <HeroUIProvider>
          <RootProvider>{children}</RootProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
