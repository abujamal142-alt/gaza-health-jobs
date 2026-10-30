import { motion } from "framer-motion";
import { Loader2, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Consistent page title block for every workspace screen. */
export function PageHeader({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap items-start justify-between gap-4"
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {sub && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {sub}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </motion.header>
  );
}

/** Spinner shown while Convex queries resolve (no skeleton placeholders). */
export function PageLoading() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
    </div>
  );
}

/**
 * The honesty banner: demo records, no live monitoring. Rendered above every
 * screen that shows vacancy data.
 */
export function DemoNotice({
  className,
  body,
}: {
  className?: string;
  body?: string;
}) {
  const { t } = useI18n();
  return (
    <Alert
      className={cn("demo-hatch border-chart-2/60 bg-chart-2/10", className)}
    >
      <TriangleAlert className="text-foreground/70" aria-hidden />
      <AlertTitle className="text-foreground">{t("common.demoTitle")}</AlertTitle>
      <AlertDescription className="text-foreground/75">
        {body ?? t("dash.demoBody")}
      </AlertDescription>
    </Alert>
  );
}
