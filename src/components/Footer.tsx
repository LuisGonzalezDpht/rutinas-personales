import useSettings from "@/store/settings";
import { getI18nText } from "@/utils/i18n";

export default function Footer() {
  const settings = useSettings();

  return (
    <footer className="border-t border-t-neutral-700 py-1 px-5">
      <p className="text-center text-xs text-neutral-400">
        {getI18nText("footer.text", settings.language)}
      </p>
    </footer>
  );
}
