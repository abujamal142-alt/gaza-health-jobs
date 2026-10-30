import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, LayoutDashboard, LogOut, Menu, Rss, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";
import { BrandMark } from "@/components/BrandMark";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Protected workspace chrome: fixed sidebar on desktop, sticky header with a
 * collapsible menu on mobile. Written with logical properties (ps/pe/start/end)
 * so it mirrors correctly in Arabic RTL.
 */
export function AppShell() {
  const { t } = useI18n();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  /** Close the mobile menu on navigation instead of via a setState-in-effect. */
  const closeMenu = () => setMenuOpen(false);

  /**
   * First run only: populate the six official sources, the DEMO vacancies and
   * the candidate profile when the workspace is empty. The mutation is
   * idempotent (URL + dedupe-key guarded), so a repeat call changes nothing.
   */
  const stats = useQuery(api.jobs.stats);
  const seedWorkspace = useMutation(api.seed.run);
  const seedAttempted = useRef(false);

  useEffect(() => {
    if (seedAttempted.current || !stats) return;
    if (stats.totalJobs > 0) {
      seedAttempted.current = true;
      return;
    }
    seedAttempted.current = true;
    seedWorkspace({}).catch((error) => {
      seedAttempted.current = false;
      console.error("Workspace seed failed", error);
    });
  }, [stats, seedWorkspace]);

  const items = [
    { to: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { to: "/vacancies", label: t("nav.vacancies"), icon: Briefcase },
    { to: "/sources", label: t("nav.sources"), icon: Rss },
    { to: "/profile", label: t("nav.profile"), icon: User },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navList = () => (
    <ul className="space-y-1">
      {items.map(({ to, label, icon: Icon }) => (
        <li key={to}>
          <NavLink
            to={to}
            onClick={closeMenu}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )
            }
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span>{label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  const signOutRow = (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-3 text-muted-foreground"
      onClick={handleSignOut}
    >
      <LogOut className="size-4" aria-hidden />
      {t("nav.signOut")}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 flex-col border-e border-border bg-sidebar lg:flex">
        <Link
          to="/"
          className="flex h-16 items-center border-b border-border px-5 transition-opacity hover:opacity-80"
        >
          <BrandMark />
        </Link>

        <nav className="flex-1 overflow-y-auto p-3" aria-label={t("nav.menu")}>
          {navList()}
        </nav>

        <div className="space-y-3 border-t border-border p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {t("nav.language")}
            </span>
            <LanguageToggle />
          </div>
          {signOutRow}
          <p className="text-center text-[11px] leading-relaxed text-muted-foreground/80">
            {t("brand.private")}
          </p>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <BrandMark compact />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-expanded={menuOpen}
              aria-label={t("nav.menu")}
              className="cursor-pointer"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden border-t border-border bg-background"
            >
              <nav className="p-3" aria-label={t("nav.menu")}>
                {navList()}
                <div className="mt-3 border-t border-border pt-3">{signOutRow}</div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Content */}
      <div className="lg:ps-64">
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </main>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
          <p className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
            JOHNNY AI JOB HUNTER · {t("land.footerNote")}
          </p>
        </footer>
      </div>
    </div>
  );
}
