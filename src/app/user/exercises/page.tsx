"use client";

import HeaderPage from "@/components/HeaderPage";
import NoAuth from "@/components/NoAuth";
import useSettings from "@/store/settings";
import { getI18nText } from "@/utils/i18n";

export default function Exercises() {
  const settings = useSettings();
  const t = (key: string) => getI18nText(key, settings.language);
  return (
    <div>
      <HeaderPage
        title={`${t("exercises.title")}`}
        subtitle={`${t("exercises.subtitle")}`}
      />
      <div className="p-2">
        <NoAuth>
          <div>{t("common.loggedInText")}</div>
        </NoAuth>
      </div>
    </div>
  );
}
