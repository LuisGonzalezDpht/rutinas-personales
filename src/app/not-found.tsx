"use client";

import useAuth from "@/store/auth";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function NotFound() {
  const auth = useAuth();
  const router = useRouter();
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const unsub = useAuth.persist?.onFinishHydration?.(() => setHydrated(true));
    if (useAuth.persist?.hasHydrated?.()) setHydrated(true);
    return () => unsub?.();
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;

    if (auth.isAuthenticated) {
      router.replace("/user/home");
    } else {
      router.replace("/auth/login");
    }
  }, [hydrated, auth.isAuthenticated, router]);

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Spinner color="primary" size="md" />
    </div>
  );
}
