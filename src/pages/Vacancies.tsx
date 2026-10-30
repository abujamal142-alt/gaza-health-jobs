import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";
import { JobCard } from "@/components/JobCard";
import { JobDetailDialog } from "@/components/JobDetailDialog";
import { DemoNotice, PageHeader, PageLoading } from "@/components/page";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobWithSource } from "@/convex/jobs";
import { specialtyLabel, useI18n } from "@/lib/i18n";
import { ALL_TAGS, scoreMatch } from "@/lib/matching";
import { cn } from "@/lib/utils";

type SortKey = "match" | "closing" | "newest";

/**
 * Vacancy discovery — the one thing version 1 had to do well: real records,
 * official links, closing dates, and an honest label on every estimate.
 */
export default function Vacancies() {
  const { t, lang } = useI18n();
  const jobs = useQuery(api.jobs.list);
  const profile = useQuery(api.profile.mine);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("match");
  const [selected, setSelected] = useState<JobWithSource | null>(null);

  const specialties = profile?.specialties;

  const results = useMemo(() => {
    if (!jobs) return [];
    const needle = search.trim().toLowerCase();

    const rows = jobs
      .filter((job) => {
        if (tag !== "all" && !job.tags.includes(tag)) return false;
        if (!needle) return true;
        const haystack = [
          job.titleAr,
          job.titleEn,
          job.locationAr,
          job.locationEn,
          job.summaryAr,
          job.summaryEn,
          job.source?.nameAr ?? "",
          job.source?.nameEn ?? "",
          ...job.tags,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      })
      .map((job) => ({
        job,
        match: specialties ? scoreMatch(job, { specialties }) : null,
      }));

    rows.sort((a, b) => {
      if (sort === "match") {
        const diff = (b.match?.score ?? 0) - (a.match?.score ?? 0);
        if (diff !== 0) return diff;
      }
      if (sort === "closing") {
        const left = a.job.closingAt ?? Number.MAX_SAFE_INTEGER;
        const right = b.job.closingAt ?? Number.MAX_SAFE_INTEGER;
        if (left !== right) return left - right;
      }
      return (b.job.postedAt ?? 0) - (a.job.postedAt ?? 0);
    });

    return rows;
  }, [jobs, search, tag, sort, specialties]);

  if (!jobs) return <PageLoading />;

  const filterTags = ["all", ...ALL_TAGS];

  return (
    <div className="space-y-6">
      <PageHeader title={t("vac.title")} sub={t("vac.sub")} />

      <DemoNotice />

      {/* toolbar */}
      <div className="space-y-3">
        <div className="relative">
          <Search
            className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("vac.searchPlaceholder")}
            className="ps-9 pe-9"
            aria-label={t("common.search")}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label={t("common.cancel")}
              className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {t("vac.specialty")}
          </span>
          {filterTags.map((key) => {
            const active = tag === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setTag(key)}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {key === "all" ? t("common.all") : specialtyLabel(lang, key)}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {t("vac.results")}:{" "}
            <span className="font-semibold text-foreground tabular-nums">
              {results.length}
            </span>
          </p>
          <Select
            value={sort}
            onValueChange={(value) => setSort(value as SortKey)}
          >
            <SelectTrigger className="w-[190px] cursor-pointer" size="sm">
              <SelectValue placeholder={t("vac.sort")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">{t("vac.sortMatch")}</SelectItem>
              <SelectItem value="closing">{t("vac.sortClosing")}</SelectItem>
              <SelectItem value="newest">{t("vac.sortNewest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {results.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>{t("vac.noResults")}</EmptyTitle>
            <EmptyDescription>
              {jobs.length === 0 ? t("vac.emptyDemo") : t("common.sample")}
            </EmptyDescription>
          </EmptyHeader>
          {(search || tag !== "all") && (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setSearch("");
                setTag("all");
              }}
            >
              {t("common.all")}
            </Button>
          )}
        </Empty>
      ) : (
        <motion.div layout className="grid gap-4">
          {results.map(({ job }, index) => (
            <JobCard
              key={job._id}
              job={job}
              index={index}
              specialties={specialties}
              onOpen={setSelected}
            />
          ))}
        </motion.div>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("job.neverSubmit")}
      </p>

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
