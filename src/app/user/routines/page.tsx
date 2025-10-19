"use client";

import CreateRoutine from "@/components/CreateRoutine";
import HeaderPage from "@/components/HeaderPage";
import NoAuth from "@/components/NoAuth";
import useAuth from "@/store/auth";

export default function Routines() {
  const auth = useAuth();

  return (
    <div>
      <HeaderPage title="Routines" subtitle="Manage your routines">
        {auth.isAuthenticated && <CreateRoutine />}
      </HeaderPage>
      <div className="p-2">
        <NoAuth>
          <div>estas logueado</div>
        </NoAuth>
      </div>
    </div>
  );
}
