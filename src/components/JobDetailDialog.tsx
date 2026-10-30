import { Check, MapPin, Sparkles } from "lucide-react";
import { OfficialLinkButton } from "@/components/OfficialLinkButton";
import {
  ClosingBadge,
  ConfirmedBadge,
  DemoBadge,
  EstimateBadge,
  MatchPill,
  SourcePausedBadge,
} from "@/components/badges";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { JobWithSource } from "@/convex/jobs";
import { specialtyLabel, useI18n } from "@/lib/i18n";
import { matchReasons, scoreMatch } from "@/lib/matching";

/** Full vacancy record: facts, estimates and the approved path off-site. */
export function JobDetailDialog({
  job,
  specialties,
  open,
  onOpenChange,
}: {
  job: JobWithSource | null;
  specialties?: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { lang, t, formatDate } = useI18n();
  if (!job) return null;

  const title = lang === "ar" ? job.titleAr : job.titleEn;
  const altTitle = lang === "ar" ? job.titleEn : job.titleAr;
  const location = lang === "ar" ? job.locationAr : job.locationEn;
  const summary = lang === "ar" ? job.summaryAr : job.summaryEn;
  const altSummary = lang === "ar" ? job.summaryEn : job.summaryAr;
  const sourceName = job.source
    ? lang === "ar"
      ? job.source.nameAr
      : job.source.nameEn
    : t("common.none");

  const match = specialties ? scoreMatch(job, { specialties }) : null;
  const reasons = match ? matchReasons(match) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-xl right-auto end-4">
        <DialogHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <DemoBadge />
            <span className="text-sm font-semibold text-foreground/80">
              {sourceName}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" aria-hidden />
              {location}
            </span>
            {job.source && !job.source.enabled && (
              <SourcePausedBadge className="ms-auto" />
            )}
          </div>
          <DialogTitle className="text-xl leading-snug font-bold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            {altTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <ClosingBadge closingAt={job.closingAt} />
          {job.postedAt && (
            <Badge
              variant="outline"
              className="border-border bg-muted text-muted-foreground"
            >
              {t("common.posted")}: {formatDate(job.postedAt)}
            </Badge>
          )}
          {job.source && !job.source.enabled && <SourcePausedBadge />}
        </div>

        <Alert className="border-chart-2/60 bg-chart-2/15 [&>svg]:text-foreground/70">
          <AlertTitle className="text-foreground">
            {t("common.demoTitle")}
          </AlertTitle>
          <AlertDescription className="text-foreground/75">
            {t("job.demoRecord")}
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <p className="text-sm leading-relaxed text-foreground/90">{summary}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {altSummary}
          </p>
        </div>

        {match && (
          <section className="rounded-lg border border-border/80 bg-muted/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold tracking-tight">
                {t("job.whyMatch")}
              </h4>
              <MatchPill score={match.score} />
              <EstimateBadge className="ms-auto" />
            </div>
            <ul className="mt-3 space-y-2">
              {reasons.length === 0 && (
                <li className="text-sm text-muted-foreground">
                  {t("match.none")}
                </li>
              )}
              {reasons.map((reason, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-foreground/90"
                >
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="size-2.5" aria-hidden />
                  </span>
                  {reason.type === "tag"
                    ? t("match.tag", { name: specialtyLabel(lang, reason.tag) })
                    : reason.type === "location"
                      ? t("match.location")
                      : t("match.role")}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold tracking-tight">
              {t("job.factsTitle")}
            </h4>
            <Sparkles className="size-3.5 text-muted-foreground" aria-hidden />
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <ConfirmedBadge className="shrink-0" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                {t("job.factConfirmed")}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <EstimateBadge className="shrink-0" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                {t("job.factDemo")}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <EstimateBadge className="shrink-0" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                {t("job.factAi")}
              </span>
            </li>
          </ul>
        </section>

        <div className="flex flex-col gap-3 border-t border-border/70 pt-4">
          {job.source && (
            <OfficialLinkButton
              url={job.officialUrl}
              label={`${t("job.openOfficial")} — ${t("job.officialSite")}`}
              className="w-full"
            />
          )}
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("job.neverSubmit")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
