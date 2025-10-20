import { settingsState } from "@/store/settings";

export default function useGetDay(settings: settingsState) {
  const days = {
    es: [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ],
    en: [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
  } as const;

  const lang = settings.language === "en" ? "en" : "es";
  const todayIndex = new Date().getDay();
  return days[lang][todayIndex];
}
