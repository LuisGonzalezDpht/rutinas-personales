"use client";

import useAuth from "@/store/auth";
import { Spinner } from "@heroui/react";

export default function NotFound() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    globalThis.location.href = "/user/home";
  }

  return (
    <>
      <div className="h-full w-full flex justify-center items-center">
        <Spinner></Spinner>
      </div>
    </>
  );
}
