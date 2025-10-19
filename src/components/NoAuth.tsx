"use client";

import useAuth from "@/store/auth";
import useSettings from "@/store/settings";
import { getI18nText } from "@/utils/i18n";

export default function NoAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const settings = useSettings();

  return (
    <>
      {!auth.isAuthenticated && (
        <div>
          <p className="text-white">
            {getI18nText("noAuth.message", settings.language)}
          </p>
        </div>
      )}

      {auth.isAuthenticated && children}
    </>
  );
}
