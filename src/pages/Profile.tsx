import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { CalendarDays, GraduationCap, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { EstimateBadge } from "@/components/badges";
import { DemoNotice, PageHeader, PageLoading } from "@/components/page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { specialtyLabel, useI18n } from "@/lib/i18n";

/**
 * Read-only candidate profile. It intentionally stores professional facts
 * only — no name, phone, or email — and version 1 offers no editing so the
 * match scores always trace back to what the user actually provided.
 */
export default function Profile() {
  const { t, lang } = useI18n();
  const profile = useQuery(api.profile.mine);

  if (profile === undefined) return <PageLoading />;

  if (!profile) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("prof.title")} sub={t("prof.sub")} />
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          {t("vac.emptyDemo")}
        </div>
      </div>
    );
  }

  const facts = [
    { label: t("prof.diploma"), value: lang === "ar" ? profile.diplomaAr : profile.diplomaEn, icon: GraduationCap },
    { label: t("prof.year"), value: String(profile.diplomaYear), icon: CalendarDays },
  ];

  const rules = [
    t("prof.ruleTags"),
    t("prof.ruleLocation"),
    t("prof.ruleRole"),
    t("prof.ruleCap"),
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t("prof.title")} sub={t("prof.sub")} />

      <DemoNotice body={t("prof.aiNote")} />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <Card className="surface-stack gap-0 border-border/80 py-0">
            <CardHeader className="border-b border-border/70 px-5 py-4">
              <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
                <GraduationCap className="size-4 text-primary" aria-hidden />
                {t("prof.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-5">
              <dl className="grid grid-cols-2 gap-4">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs text-muted-foreground">{fact.label}</dt>
                    <dd className="mt-1 flex items-center gap-2 text-base font-semibold tracking-tight">
                      <fact.icon className="size-4 text-primary" aria-hidden />
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div>
                <h3 className="text-xs text-muted-foreground">
                  {t("prof.specialties")}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.specialties.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-medium">
                      {specialtyLabel(lang, tag)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs text-muted-foreground">
                  {t("prof.experience")}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                  {lang === "ar" ? profile.experienceAr : profile.experienceEn}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Alert className="border-primary/30 bg-primary/5">
              <ShieldCheck className="text-primary" aria-hidden />
              <AlertTitle>{t("prof.privacy")}</AlertTitle>
              <AlertDescription>{t("prof.privacyBody")}</AlertDescription>
            </Alert>
            <Alert className="border-primary/30 bg-primary/5">
              <Lock className="text-primary" aria-hidden />
              <AlertTitle>{t("prof.noInvented")}</AlertTitle>
              <AlertDescription>{t("prof.noInventedBody")}</AlertDescription>
            </Alert>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="space-y-4"
        >
          <Card className="gap-4 border-border/80 p-5">
            <CardHeader className="gap-3 p-0">
              <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
                <Sparkles className="size-4 text-primary" aria-hidden />
                {t("prof.matchRules")}
              </CardTitle>
              <div>
                <EstimateBadge />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-0">
              <ol className="space-y-3">
                {rules.map((rule, index) => (
                  <li key={rule} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary tabular-nums">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/90">
                      {rule}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="border-t border-border/70 pt-3 text-xs leading-relaxed text-muted-foreground">
                {t("prof.aiNote")}
              </p>
            </CardContent>
          </Card>

          <Alert>
            <Sparkles className="text-muted-foreground" aria-hidden />
            <AlertTitle>{t("job.factsTitle")}</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{t("job.factConfirmed")}</p>
              <p>{t("job.factAi")}</p>
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    </div>
  );
}
