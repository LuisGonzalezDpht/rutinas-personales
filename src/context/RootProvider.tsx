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

  if (pathname === "/recover" || pathname === "/auth/login") {
    return <Wrapper>{children}</Wrapper>;
  }

  return auth.isAuthenticated ? (
    <Wrapper>
      <SideBar />
      <div className="h-screen overflow-auto">
        {children}
        <Footer />
      </div>
    </Wrapper>
  ) : (
    <main className="min-h-screen w-full flex items-center justify-center dark:bg-neutral-950">
      <Spinner></Spinner>
    </main>
  );
}
