import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, type buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

/**
 * The single exit point from the app to the outside world.
 *
 * Nothing opens an external site without an explicit approval step, and the
 * app never submits anything: this only hands the user a link in a new tab.
 */
export function OfficialLinkButton({
  url,
  label,
  variant = "outline",
  size = "default",
  className,
}: {
  url: string;
  label?: string;
  variant?: ButtonVariant;
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  className?: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const openOfficial = () => {
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
    toast.success(t("job.opened"));
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn("cursor-pointer gap-2", className)}
        onClick={() => setOpen(true)}
      >
        <ExternalLink className="size-4" aria-hidden />
        {label ?? t("common.officialLink")}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("job.approvalTitle")}</AlertDialogTitle>
            <AlertDialogDescription className="leading-relaxed">
              {t("job.approvalBody")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-lg border border-dashed border-border bg-muted px-3 py-2 text-xs break-all text-muted-foreground">
            {url}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("job.neverSubmit")}
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              {t("job.decline")}
            </AlertDialogCancel>
            <AlertDialogAction className="cursor-pointer" onClick={openOfficial}>
              {t("job.approve")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
