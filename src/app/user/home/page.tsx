"use client";

import HeaderPage from "@/components/HeaderPage";
import NoAuth from "@/components/NoAuth";
import { ApiValidateLogin } from "@/utils/supabase/api/auth";
import useSettings from "@/store/settings";
import { getI18nText } from "@/utils/i18n";
import React from "react";

export default function Home() {
  React.useEffect(() => {
    ApiValidateLogin();
  }, []);

  const settings = useSettings();
  const t = (key: string) => getI18nText(key, settings.language);

  return (
    <div>
      <HeaderPage
        title={`${t("home.title")}`}
        subtitle={`${t("home.subtitle")}`}
      />
      <div className="p-2">
        <NoAuth>
          <div>{t("common.loggedInText")}</div>
        </NoAuth>
      </div>
    </div>
  );
}
