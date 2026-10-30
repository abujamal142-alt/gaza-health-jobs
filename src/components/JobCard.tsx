import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OfficialLinkButton } from "@/components/OfficialLinkButton";
import {
  ClosingBadge,
  DemoBadge,
  MatchPill,
  SourcePausedBadge,
} from "@/components/badges";
import type { JobWithSource } from "@/convex/jobs";
import { specialtyLabel, useI18n } from "@/lib/i18n";
import { scoreMatch } from "@/lib/matching";

/**
 * One vacancy record. Layout is mobile-first: metadata stacks under the title
 * on small screens and sits alongside it from `sm` up.
 */
export function JobCard({
  job,
  specialties,
  onOpen,
  index = 0,
}: {
  job: JobWithSource;
  /** Profile specialties; omit to show a card without a match score. */
  specialties?: string[];
  onOpen: (job: JobWithSource) => void;
  index?: number;
}) {
  const { lang, t } = useI18n();

  const title = lang === "ar" ? job.titleAr : job.titleEn;
  const altTitle = lang === "ar" ? job.titleEn : job.titleAr;
  const location = lang === "ar" ? job.locationAr : job.locationEn;
  const summary = lang === "ar" ? job.summaryAr : job.summaryEn;
  const sourceName = job.source
    ? lang === "ar"
      ? job.source.nameAr
      : job.source.nameEn
    : t("common.none");

  const match = specialties ? scoreMatch(job, { specialties }) : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className="surface-stack rounded-xl border border-border/80 p-4 transition-colors hover:border-primary/40 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground/80">{sourceName}</span>
            <span aria-hidden className="hidden sm:inline">
              ·
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden />
              {location}
            </span>
          </div>
          <h3 className="mt-2 text-base font-bold tracking-tight sm:text-lg">
            {title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {summary}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <DemoBadge />
          {match && <MatchPill score={match.score} />}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {job.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="font-medium"
          >
            {specialtyLabel(lang, tag)}
          </Badge>
        ))}
        <ClosingBadge closingAt={job.closingAt} />
        {job.source && !job.source.enabled && <SourcePausedBadge />}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-3">
        <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
          {altTitle}
        </p>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="cursor-pointer flex-1 sm:flex-none"
            onClick={() => onOpen(job)}
          >
            {t("vac.viewDetails")}
          </Button>
          {job.source && (
            <OfficialLinkButton
              url={job.officialUrl}
              size="sm"
              variant="ghost"
              className="flex-1 sm:flex-none"
            />
          )}
        </div>
      </div>
    </motion.article>
  );
}
