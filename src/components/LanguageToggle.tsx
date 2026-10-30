import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Segmented AR / EN switch. Arabic is the default; the choice persists and
 * flips `dir` on <html> so the whole layout mirrors.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();

  const options: Array<{ value: Lang; label: string }> = [
    { value: "ar", label: "عربي" },
    { value: "en", label: "EN" },
  ];

  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-muted p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const active = lang === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(option.value)}
            className={cn(
              "cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
              active
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
