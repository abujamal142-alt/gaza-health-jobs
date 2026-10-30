import { CalendarDays, Check, Sparkles, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { closingState, daysLeft } from "@/lib/matching";
import { cn } from "@/lib/utils";

/** Marks a record as sample data. Shown on every demo vacancy. */
export function DemoBadge({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <Badge
      variant="outline"
      title={t("common.demoTitle")}
      className={cn(
        "border-chart-2/70 bg-chart-2/25 font-bold tracking-[0.08em] text-foreground",
        className,
      )}
    >
      {t("common.demoLabel")}
    </Badge>
  );
}

/** A fact that was verified on the official source. */
export function ConfirmedBadge({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-primary/35 bg-primary/10 text-primary",
        className,
      )}
    >
      <Check className="size-3" aria-hidden />
      {t("common.confirmed")}
    </Badge>
  );
}

/** A machine-produced value — always visually distinct from confirmed facts. */
export function EstimateBadge({
  className,
  short = false,
}: {
  className?: string;
  short?: boolean;
}) {
  const { t } = useI18n();
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-dashed border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      <Sparkles className="size-3" aria-hidden />
      {short ? t("common.estimateShort") : t("common.aiEstimate")}
    </Badge>
  );
}

/** Match score pill. Always labelled as an estimate, never as a fact. */
export function MatchPill({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <span
      title={`${t("job.matchScore")}: ${score}% — ${t("common.aiEstimate")}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary",
        className,
      )}
    >
      <Sparkles className="size-3" aria-hidden />
      {score}%
      <span className="text-[10px] font-medium opacity-80">
        {t("common.estimateShort")}
      </span>
    </span>
  );
}

/** Closing date badge: closed / closing soon (≤14 days) / open. */
export function ClosingBadge({
  closingAt,
  className,
}: {
  closingAt?: number;
  className?: string;
}) {
  const { t, formatDate } = useI18n();
  const state = closingState(closingAt);
  if (state === "none" || closingAt === undefined) return null;

  if (state === "closed") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 border-destructive/40 bg-destructive/10 text-destructive",
          className,
        )}
      >
        <TriangleAlert className="size-3" aria-hidden />
        {t("vac.closed")}
      </Badge>
    );
  }

  const left = daysLeft(closingAt);
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border-border bg-muted text-muted-foreground",
        state === "soon" &&
          "border-chart-2/70 bg-chart-2/25 font-semibold text-foreground",
        className,
      )}
    >
      <CalendarDays className="size-3" aria-hidden />
      {formatDate(closingAt)}
      {state === "soon" && left !== null && (
        <span className="font-bold">· {t("vac.daysLeft", { days: left })}</span>
      )}
    </Badge>
  );
}

/** Shown when a vacancy belongs to a source the user has paused. */
export function SourcePausedBadge({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <Badge
      variant="outline"
      className={cn("border-border bg-muted text-muted-foreground", className)}
    >
      {t("common.sourceOff")}
    </Badge>
  );
}
