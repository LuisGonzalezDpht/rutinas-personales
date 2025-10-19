interface I18nItem {
  [key: string]: string;
  id: string;
  en: string;
  es: string;
}

const defaultItem: Partial<I18nItem> = {
  en: "No translation available",
  es: "Traducción no disponible",
};

export function getI18n(id: string) {
  const library = require("./library.json");
  const item = library.find((item: { id: string }) => item.id === id);
  if (!item) {
    return {
      ...defaultItem,
      id,
    };
  }
  return item as I18nItem;
}

export function getI18nText(id: string, lang: string) {
  const item = getI18n(id);
  return (lang === "en" || lang === "es" ? item[lang] : undefined) || item.en;
}

export function getI18nTextEs(id: string) {
  return getI18nText(id, "es");
}

export function getI18nTextEn(id: string) {
  return getI18nText(id, "en");
}
