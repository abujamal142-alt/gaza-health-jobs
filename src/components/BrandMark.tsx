import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Typographic brand lockup used in the app shell, landing page and auth screen.
 * The Latin wordmark stays Latin in both languages on purpose.
 */
export function BrandMark({
  className,
  compact = false,
}: {
  className?: string;
  /** Hide the "AI JOB HUNTER" line (mobile header). */
  compact?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Stethoscope className="size-5" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight">JOHNNY</span>
        {!compact && (
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            AI Job Hunter
          </span>
        )}
      </span>
    </span>
  );
}
