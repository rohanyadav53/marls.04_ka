import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Inbox, FileBarChart, Settings, LogOut, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../auth";

const NAV: { to: string; label: string; Icon: LucideIcon; end?: boolean }[] = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/leads", label: "Leads", Icon: Inbox },
  { to: "/reports", label: "Reports", Icon: FileBarChart },
  { to: "/settings", label: "Settings", Icon: Settings },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
    isActive ? "bg-blue text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
  }`;
}

/**
 * Portal chrome: brand bar, navigation, sign-out.
 *
 * The sidebar collapses into a drawer under `lg` so the leads table stays
 * usable on a phone — the sales team reads these on the road.
 */
export default function Shell() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile bar */}
      <div className="flex items-center justify-between bg-ink px-4 py-3 lg:hidden">
        <span className="font-display text-sm font-bold tracking-wide text-white">MARLSBORO ADMIN</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="lg:flex">
        <aside
          className={`${open ? "block" : "hidden"} bg-ink px-4 pb-6 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0 lg:px-5 lg:py-6`}
        >
          <div className="mb-8 hidden lg:block">
            <div className="font-display text-base font-bold tracking-wide text-white">MARLSBORO</div>
            <div className="eyebrow mt-0.5 text-white/50">Admin Portal</div>
          </div>

          <nav className="space-y-1 pt-3 lg:pt-0">
            {NAV.map(({ to, label, Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={navClass} onClick={() => setOpen(false)}>
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 border-t border-white/10 pt-5">
            {user && (
              <div className="mb-3 px-1">
                <div className="truncate text-sm font-semibold text-white">{user.name}</div>
                <div className="truncate text-xs text-white/50">{user.email}</div>
                <div className="eyebrow mt-1 text-white/40">{user.role}</div>
              </div>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4.5 w-4.5" aria-hidden="true" />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
