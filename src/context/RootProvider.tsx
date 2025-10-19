"use client";

import { usePathname } from "next/navigation";
import Wrapper from "@/components/Wrapper";
import SideBar from "@/components/SideBar";
import Footer from "@/components/Footer";
import useAuth from "@/store/auth";
import { Spinner } from "@heroui/react";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const pathname = usePathname();

  // Rutas sin sidebar
  if (pathname === "/auth/recover" || pathname === "/auth/login") {
    return <Wrapper>{children}</Wrapper>;
  }

  if (!auth.isAuthenticated) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center dark:bg-neutral-950">
        <Spinner />
      </main>
    );
  }

  return (
    <Wrapper>
      {/* Sidebar */}
      <SideBar />

      {/* Contenido principal */}
      <div
        className={`flex-1 h-screen overflow-auto transition-all duration-200`}
      >
        <div className="flex flex-col justify-between h-full">
          {children}
          <Footer />
        </div>
      </div>
    </Wrapper>
  );
}
