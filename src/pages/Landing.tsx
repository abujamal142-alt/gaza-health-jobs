import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ExternalLink,
  Gauge,
  Link2,
  Lock,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router";
import { BrandMark } from "@/components/BrandMark";
import { LanguageToggle } from "@/components/LanguageToggle";
import { OfficialLinkButton } from "@/components/OfficialLinkButton";
import {
  ConfirmedBadge,
  DemoBadge,
  EstimateBadge,
} from "@/components/badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { SEED_SOURCES } from "@/convex/demoData";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

/** Bilingual public landing page. Arabic-first, no invented statistics. */
export default function Landing() {
  const { t, isAr } = useI18n();
  const { isAuthenticated, isLoading } = useAuth();

  const dashboardHref = isAuthenticated ? "/dashboard" : "/auth";
  const ctaLabel = isAuthenticated ? t("land.ctaDashboard") : t("land.cta");

  const principles = [
    { icon: Link2, title: t("land.p1Title"), body: t("land.p1Body") },
    { icon: BadgeCheck, title: t("land.p2Title"), body: t("land.p2Body") },
    { icon: Gauge, title: t("land.p3Title"), body: t("land.p3Body") },
    { icon: Lock, title: t("land.p4Title"), body: t("land.p4Body") },
  ];

  const steps = [
    { title: t("land.step1Title"), body: t("land.step1Body") },
    { title: t("land.step2Title"), body: t("land.step2Body") },
    { title: t("land.step3Title"), body: t("land.step3Body") },
  ];

  const limits = [
    t("land.limit1"),
    t("land.limit2"),
    t("land.limit3"),
    t("land.limit4"),
    t("land.limit5"),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <Button asChild size="sm" className="cursor-pointer">
              <Link to={dashboardHref}>
                {isLoading ? t("common.loading") : ctaLabel}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/8 to-transparent"
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="border-chart-2/70 bg-chart-2/20 text-foreground"
            >
              {t("land.eyebrow")}
            </Badge>

            <h1 className="mt-5 text-3xl leading-[1.15] font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
              {t("land.heroTitle")}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("land.heroSub")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="cursor-pointer gap-2">
                <Link to={dashboardHref}>
                  {ctaLabel}
                  {isAr ? (
                    <ArrowRight className="size-4 rotate-180" aria-hidden />
                  ) : (
                    <ArrowRight className="size-4" aria-hidden />
                  )}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="cursor-pointer"
              >
                <a href="#sources">{t("land.ctaSources")}</a>
              </Button>
            </div>

            <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <X className="mt-0.5 size-4 shrink-0 text-chart-5" aria-hidden />
              {t("land.heroNotice")}
            </p>
          </motion.div>

          {/* card anatomy — no invented vacancy, just how a record reads */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="surface-stack rounded-2xl border border-border/80 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold tracking-tight">
                {t("land.showcase")}
              </span>
              <DemoBadge />
            </div>

            <ul className="mt-5 space-y-4">
              <li className="flex items-start justify-between gap-3">
                <span className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Link2 className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {t("common.officialLink")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("land.p1Body")}
                    </span>
                  </span>
                </span>
                <ConfirmedBadge className="shrink-0" />
              </li>

              <li className="flex items-start justify-between gap-3">
                <span className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CalendarDays className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {t("common.closingDate")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("job.factDemo")}
                    </span>
                  </span>
                </span>
                <Badge
                  variant="outline"
                  className="shrink-0 border-chart-2/70 bg-chart-2/20 text-foreground"
                >
                  {t("common.sample")}
                </Badge>
              </li>

              <li className="flex items-start justify-between gap-3">
                <span className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {t("job.matchScore")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("match.aiNote")}
                    </span>
                  </span>
                </span>
                <EstimateBadge className="shrink-0" />
              </li>
            </ul>

            <div className="mt-5 rounded-lg border border-dashed border-border bg-muted/60 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
              {t("job.neverSubmit")}
            </div>

            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              {t("land.showcaseNote")}
            </p>
          </motion.aside>
        </div>
      </section>

      {/* official sources */}
      <section id="sources" className="border-t border-border/70 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("land.sourcesTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {t("land.sourcesSub")}
            </p>
          </motion.div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SEED_SOURCES.map((source, index) => (
              <motion.div
                key={source.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold tracking-tight">
                    {isAr ? source.nameAr : source.nameEn}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground" dir="ltr">
                    {new URL(source.url).hostname}
                  </p>
                </div>
                <OfficialLinkButton
                  url={source.url}
                  label={t("land.visit")}
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                />
              </motion.div>
            ))}
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="size-3.5" aria-hidden />
            {t("job.approvalBody")}
          </p>
        </div>
      </section>

      {/* how it works */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <motion.h2
          {...fadeUp}
          className="text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {t("land.howTitle")}
        </motion.h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="surface-stack rounded-xl border border-border/80 p-5"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground tabular-nums">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-bold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* principles */}
      <section className="border-t border-border/70 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("land.principlesTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("land.principlesSub")}
            </p>
          </motion.div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="flex gap-4 rounded-xl border border-border/80 bg-card p-5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <principle.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-bold tracking-tight">
                    {principle.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {principle.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* out of scope — stated openly */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          className="rounded-2xl border border-dashed border-border p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            {t("land.limitsTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("land.limitsSub")}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {limits.map((limit) => (
              <Badge
                key={limit}
                variant="outline"
                className="border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground line-through decoration-destructive/60"
              >
                {limit}
              </Badge>
            ))}
          </div>
          <p className="mt-5 text-sm font-medium text-foreground/80">
            {t("land.limitsNote")}
          </p>
        </motion.div>
      </section>

      {/* final CTA */}
      <section className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6 lg:px-8">
          <motion.h2
            {...fadeUp}
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {t("land.finalTitle")}
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="max-w-xl text-sm leading-relaxed text-muted-foreground"
          >
            {t("land.finalSub")}
          </motion.p>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.14 }}>
            <Button asChild size="lg" className="cursor-pointer gap-2">
              <Link to={dashboardHref}>
                {ctaLabel}
                {isAr ? (
                  <ArrowRight className="size-4 rotate-180" aria-hidden />
                ) : (
                  <ArrowRight className="size-4" aria-hidden />
                )}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border/70 bg-muted/30">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <BrandMark />
          <p className="text-xs text-muted-foreground">
            JOHNNY AI JOB HUNTER · {t("land.footerNote")}
          </p>
        </div>
      </footer>
    </div>
  );
}
