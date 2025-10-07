"use client";

import useAuth from "@/store/auth";

export default function noAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return (
    <>
      {!auth.isAuthenticated && (
        <div>
          <p className="text-white">
            You need to be logged in to access this page.
          </p>
        </div>
      )}

      {auth.isAuthenticated && children}
    </>
  );
}
