import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { CircleCheck, Pencil, Plus, Power, Rss } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { DemoNotice, PageHeader, PageLoading } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";

type SourceDoc = Doc<"jobSources">;

/** Official source manager: add, edit, enable, disable — plus the check log. */
export default function Sources() {
  const { t, isAr, formatRelative } = useI18n();
  const data = useQuery(api.sources.list);
  const addSource = useMutation(api.sources.add);
  const updateSource = useMutation(api.sources.update);
  const setSourceEnabled = useMutation(api.sources.setEnabled);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SourceDoc | null>(null);
  const [form, setForm] = useState({ nameAr: "", nameEn: "", url: "" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!data) return <PageLoading />;

  const openAdd = () => {
    setEditing(null);
    setForm({ nameAr: "", nameEn: "", url: "" });
    setError(null);
    setDialogOpen(true);
  };

  const openEdit = (source: SourceDoc) => {
    setEditing(source);
    setForm({ nameAr: source.nameAr, nameEn: source.nameEn, url: source.url });
    setError(null);
    setDialogOpen(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const result = editing
        ? await updateSource({ id: editing._id, ...form })
        : await addSource(form);

      if (!result.ok) {
        setError(
          result.reason === "exists"
            ? t("src.errExists")
            : result.reason === "url"
              ? t("src.errUrl")
              : t("src.errName"),
        );
        return;
      }

      toast.success(editing ? t("src.updated") : t("src.saved"));
      setDialogOpen(false);
    } catch (err) {
      console.error("Source save failed", err);
      setError(t("src.errUrl"));
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (source: SourceDoc, enabled: boolean) => {
    try {
      await setSourceEnabled({ id: source._id, enabled });
      toast.success(enabled ? t("src.toggledOn") : t("src.toggledOff"));
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  // `checks` arrives newest-first, so the first row seen per source wins.
  const checksBySource = new Map<string, Doc<"sourceChecks">>();
  for (const check of data.checks) {
    if (!checksBySource.has(check.sourceId)) {
      checksBySource.set(check.sourceId, check);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("src.title")} sub={t("src.sub")}>
        <Button className="cursor-pointer gap-2" onClick={openAdd}>
          <Plus className="size-4" aria-hidden />
          {t("src.add")}
        </Button>
      </PageHeader>

      <DemoNotice body={t("src.checkNote")} />

      <div className="space-y-3">
        {data.sources.map((source, index) => {
          const check = checksBySource.get(source._id);
          return (
            <motion.div
              key={source._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.25) }}
            >
              <Card className="surface-stack gap-0 border-border/80 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Rss className="size-4" aria-hidden />
                      </span>
                      <h3 className="text-sm font-bold tracking-tight">
                        {isAr ? source.nameAr : source.nameEn}
                      </h3>
                      {source.isBuiltIn && (
                        <Badge
                          variant="outline"
                          className="border-border bg-muted text-[10px] text-muted-foreground"
                        >
                          {t("common.confirmed")}
                        </Badge>
                      )}
                    </div>
                    <p
                      className="mt-2 truncate text-xs text-muted-foreground"
                      dir="ltr"
                    >
                      {source.url}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Switch
                      checked={source.enabled}
                      onCheckedChange={(checked) => toggle(source, checked)}
                      aria-label={
                        source.enabled ? t("common.enabled") : t("common.disabled")
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="cursor-pointer"
                      aria-label={t("common.edit")}
                      onClick={() => openEdit(source)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border/70 pt-3 text-xs text-muted-foreground">
                  {source.enabled ? (
                    <span className="inline-flex items-center gap-1 font-medium text-primary">
                      <CircleCheck className="size-3" aria-hidden />
                      {t("common.enabled")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Power className="size-3" aria-hidden />
                      {t("common.disabled")}
                    </span>
                  )}
                  <span aria-hidden>·</span>
                  <span>
                    {t("dash.lastCheck")}:{" "}
                    {check ? formatRelative(check._creationTime) : t("dash.noLive")}
                  </span>
                  {check && (
                    <>
                      <span aria-hidden>·</span>
                      <span>
                        {check.foundCount} {t("src.found")}
                      </span>
                      <span aria-hidden>·</span>
                      <span>
                        {check.newCount} {t("src.fresh")}
                      </span>
                    </>
                  )}
                  <Badge
                    variant="outline"
                    className="border-chart-2/70 bg-chart-2/20 text-foreground"
                  >
                    {t("common.demoLabel")}
                  </Badge>
                </div>

                {check?.note && (
                  <p className="mt-1.5 text-xs text-muted-foreground/80">
                    {isAr ? check.note : t("src.checkNote")}
                  </p>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="gap-4 border-border/80 p-5">
        <CardHeader className="gap-2 p-0">
          <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
            <Power className="size-4 text-primary" aria-hidden />
            {t("src.history")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-0 text-sm text-muted-foreground">
          <p className="leading-relaxed">{t("src.builtInNote")}</p>
          <p className="leading-relaxed">{t("src.checkNote")}</p>
        </CardContent>
      </Card>

      {/* add / edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md right-auto end-4">
          <DialogHeader>
            <DialogTitle>
              {editing ? t("src.editTitle") : t("src.addTitle")}
            </DialogTitle>
            <DialogDescription>{t("src.urlHint")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="source-name-ar">{t("src.nameAr")}</Label>
              <Input
                id="source-name-ar"
                value={form.nameAr}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    nameAr: event.target.value,
                  }))
                }
                placeholder={t("src.namePlaceholder")}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="source-name-en">{t("src.nameEn")}</Label>
              <Input
                id="source-name-en"
                value={form.nameEn}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    nameEn: event.target.value,
                  }))
                }
                placeholder="International health organization"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="source-url">{t("src.url")}</Label>
              <Input
                id="source-url"
                type="url"
                dir="ltr"
                value={form.url}
                onChange={(event) =>
                  setForm((current) => ({ ...current, url: event.target.value }))
                }
                placeholder={t("src.urlPlaceholder")}
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setDialogOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" className="cursor-pointer" disabled={saving}>
                {t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
