import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CircleCheck,
  Rss,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { api } from "@/convex/_generated/api";
import { JobCard } from "@/components/JobCard";
import { JobDetailDialog } from "@/components/JobDetailDialog";
import {
  ClosingBadge,
  ConfirmedBadge,
  DemoBadge,
  EstimateBadge,
} from "@/components/badges";
import { DemoNotice, PageHeader, PageLoading } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobWithSource } from "@/convex/jobs";
import { useI18n } from "@/lib/i18n";
import { closingState, scoreMatch } from "@/lib/matching";

/**
 * Version 1 dashboard, ordered by the product decision: NEW MATCHING
 * VACANCIES FIRST. Statistics and alerts come after, and every number is
 * counted from stored records rather than estimated.
 */
export default function Dashboard() {
  const { t, isAr } = useI18n();
  const jobs = useQuery(api.jobs.list);
  const stats = useQuery(api.jobs.stats);
  const profile = useQuery(api.profile.mine);
  const sources = useQuery(api.sources.list);
  const [selected, setSelected] = useState<JobWithSource | null>(null);

  const specialties = profile?.specialties;

  const ranked = useMemo(() => {
    if (!specialties || !jobs) return [];
    return jobs
      .map((job) => ({ job, match: scoreMatch(job, { specialties }) }))
      .filter((row) => row.match.isMatching)
      .sort((a, b) => {
        if (b.match.score !== a.match.score) return b.match.score - a.match.score;
        return (a.job.closingAt ?? Number.MAX_SAFE_INTEGER) -
          (b.job.closingAt ?? Number.MAX_SAFE_INTEGER);
      });
  }, [jobs, specialties]);

  const alerts = useMemo(() => {
    if (!jobs) return [];
    return jobs
      .filter((job) => closingState(job.closingAt) === "soon")
      .sort((a, b) => (a.closingAt ?? 0) - (b.closingAt ?? 0));
  }, [jobs]);

  if (!jobs || !stats || !sources) return <PageLoading />;

  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const top = ranked.slice(0, 5);

  const statCards = [
    {
      label: t("dash.statTotal"),
      value: stats.totalJobs,
      icon: Briefcase,
      hint: `${stats.demoJobs} ${t("common.demoLabel")}`,
    },
    {
      label: t("dash.statMatching"),
      value: ranked.length,
      icon: Sparkles,
      hint: t("common.estimateShort"),
    },
    {
      label: t("dash.statClosingSoon"),
      value: stats.closingSoon,
      icon: AlarmClock,
      hint: t("dash.alertsSub"),
    },
    {
      label: t("dash.statSources"),
      value: `${stats.activeSources}/${stats.totalSources}`,
      icon: Rss,
      hint: t("common.enabled"),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title={t("dash.title")} sub={t("dash.sub")} />

      <DemoNotice />

      {/* 1 — the reason the product exists */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">
              {t("dash.newMatching")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("dash.newMatchingSub")}
              {specialties && (
                <span className="ms-1.5 inline-flex align-middle">
                  <EstimateBadge short />
                </span>
              )}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="cursor-pointer">
            <Link to="/vacancies">
              {t("dash.goVacancies")}
              <Arrow className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            {t("vac.emptyDemo")}
          </div>
        ) : top.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            {t("dash.noMatching")}
          </div>
        ) : (
          <div className="grid gap-4">
            {top.map(({ job }, index) => (
              <JobCard
                key={job._id}
                job={job}
                index={index}
                specialties={specialties}
                onOpen={setSelected}
              />
            ))}
          </div>
        )}
      </motion.section>

      {/* 2 — counted, never invented */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">
          {t("dash.stats")}
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="surface-stack gap-3 border-border/80 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <stat.icon className="size-4" aria-hidden />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight tabular-nums">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {stat.hint}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{t("dash.statNote")}</p>
      </section>

      {/* 3 — alerts + source status */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="gap-0 border-border/80 py-0">
          <CardHeader className="border-b border-border/70 px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
              <AlarmClock className="size-4 text-primary" aria-hidden />
              {t("dash.alerts")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{t("dash.alertsSub")}</p>
          </CardHeader>
          <CardContent className="p-0">
            {alerts.length === 0 ? (
              <p className="px-5 py-6 text-sm text-muted-foreground">
                {t("dash.alertNone")}
              </p>
            ) : (
              <ul className="divide-y divide-border/70">
                {alerts.slice(0, 5).map((job) => (
                  <li key={job._id}>
                    <button
                      type="button"
                      onClick={() => setSelected(job)}
                      className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-3.5 text-start transition-colors hover:bg-accent"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {isAr ? job.titleAr : job.titleEn}
                        </span>
                        <span className="mt-1 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-border bg-muted text-[10px] text-muted-foreground"
                          >
                            {t("common.demoLabel")}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {job.source
                              ? isAr
                                ? job.source.nameAr
                                : job.source.nameEn
                              : ""}
                          </span>
                        </span>
                      </span>
                      <ClosingBadge closingAt={job.closingAt} className="shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="gap-0 border-border/80 py-0">
          <CardHeader className="border-b border-border/70 px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
              <Rss className="size-4 text-primary" aria-hidden />
              {t("dash.sourcesStatus")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{t("dash.sourcesSub")}</p>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border/70">
              {sources.sources.map((source) => (
                <li
                  key={source._id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {isAr ? source.nameAr : source.nameEn}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("dash.lastCheck")}: {t("dash.noLive")}
                    </span>
                  </span>
                  {source.enabled ? (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-primary/30 bg-primary/10 text-primary"
                    >
                      <CircleCheck className="size-3" aria-hidden />
                      {t("common.enabled")}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-border bg-muted text-muted-foreground"
                    >
                      {t("common.disabled")}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-2 border-t border-border/70 px-5 py-3.5">
              <DemoBadge />
              <span className="text-xs text-muted-foreground">
                {t("src.checkNote")}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* label legend: how to read every record in this app */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-border/80 bg-card p-4">
        <ConfirmedBadge />
        <span className="text-xs text-muted-foreground">
          {t("job.factConfirmed")}
        </span>
        <EstimateBadge />
        <span className="text-xs text-muted-foreground">
          {t("job.factAi")}
        </span>
        <DemoBadge />
        <span className="text-xs text-muted-foreground">
          {t("dash.demoBody")}
        </span>
      </div>

      <JobDetailDialog
        job={selected}
        specialties={specialties}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
