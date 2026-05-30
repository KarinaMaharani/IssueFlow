import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Inbox,
  LayoutGrid,
  Network,
  Settings,
  ChevronRight,
  ChevronDown,
  Sparkles,
  CreditCard,
  KeyRound,
  Wallet,
  HelpCircle,
  Flame,
  Layers,
  Lock,
  User,
  Bell,
  Search,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  label: string;
  to: string;
  icon?: any;
  count?: number | string;
  tone?: string;
  search?: Record<string, string>;
};
type Group = { label: string; items: Item[]; defaultOpen?: boolean };

const groups: Group[] = [
  {
    label: "Workspace",
    defaultOpen: true,
    items: [
      { label: "Inbox", to: "/", icon: Inbox, count: 7 },
      { label: "Board", to: "/board", icon: LayoutGrid, count: 13 },
      { label: "Clusters", to: "/clusters", icon: Network, count: 3 },
    ],
  },
  {
    label: "Lanes",
    defaultOpen: true,
    items: [
      { label: "Payment Ops", to: "/board", icon: CreditCard, count: 4, tone: "text-accent", search: { lane: "payment" } },
      { label: "Account Support", to: "/board", icon: KeyRound, count: 3, tone: "text-info", search: { lane: "account" } },
      { label: "Finance", to: "/board", icon: Wallet, count: 3, tone: "text-warning", search: { lane: "finance" } },
      { label: "General", to: "/board", icon: HelpCircle, count: 2, search: { lane: "general" } },
    ],
  },
  {
    label: "Filters",
    defaultOpen: true,
    items: [
      { label: "My tickets", to: "/", icon: User, count: 3, search: { filter: "mine" } },
      { label: "High priority", to: "/", icon: Flame, count: 4, tone: "text-destructive", search: { filter: "priority" } },
      { label: "Multi-issue", to: "/", icon: Layers, count: 1, tone: "text-accent", search: { filter: "multi" } },
      { label: "Held replies", to: "/", icon: Lock, count: 2, tone: "text-warning", search: { filter: "held" } },
    ],
  },
];

export function AppLayout({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb?: { label: string; to?: string }[];
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search }) as unknown as Record<string, unknown>;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="w-60 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border sticky top-0 h-screen self-start">
        <div className="px-4 py-3.5 border-b border-sidebar-border flex items-center gap-2">
          <div className="size-8 rounded-md bg-accent grid place-items-center shrink-0">
            <Sparkles className="size-4 text-accent-foreground" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">IssueFlow</div>
            <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50">
              Support OS
            </div>
          </div>
        </div>

        <div className="px-3 pt-3">
          <button className="w-full inline-flex items-center justify-center gap-1.5 h-8 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90">
            <Plus className="size-3.5" /> New ticket
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-3 overflow-y-auto">
          {groups.map((g) => (
            <SidebarGroup key={g.label} group={g} pathname={pathname} search={search} />
          ))}
        </nav>

        <div className="m-3 p-3 rounded-md bg-sidebar-accent/50 border border-sidebar-border">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-white">
            <Sparkles className="size-3 text-accent" /> AI Copilot
          </div>
          <p className="mt-1 text-[10px] text-sidebar-foreground/60 leading-snug">
            Demux processed <span className="text-white font-medium">37</span> tickets · Mux watching{" "}
            <span className="text-white font-medium">8</span> clusters.
          </p>
        </div>

        <div className="px-3 pb-3 pt-1 border-t border-sidebar-border flex items-center gap-2">
          <div className="size-7 rounded-full bg-accent/80 text-white grid place-items-center text-[10px] font-medium">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-white truncate">Adi Damar</div>
            <div className="text-[9px] uppercase tracking-wider text-sidebar-foreground/50">
              Tier 2 · Online
            </div>
          </div>
          <button type="button" className="text-sidebar-foreground/60 hover:text-white">
            <Settings className="size-3.5" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 border-b bg-card flex items-center px-4 gap-3">
          {breadcrumb && (
            <div className="flex items-center text-xs text-muted-foreground">
              {breadcrumb.map((b, i) => (
                <span key={i} className="flex items-center">
                  {i > 0 && <ChevronRight className="size-3 mx-1.5" />}
                  {b.to ? (
                    <Link to={b.to} className="hover:text-foreground">{b.label}</Link>
                  ) : (
                    <span className="text-foreground font-medium">{b.label}</span>
                  )}
                </span>
              ))}
            </div>
          )}
          <div className="flex-1 max-w-sm ml-auto relative">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search tickets, clusters…"
              className="w-full h-8 pl-8 pr-2.5 bg-secondary/60 rounded-md text-xs outline-none focus:bg-secondary border border-transparent focus:border-border"
            />
          </div>
          <button className="size-8 grid place-items-center rounded-md hover:bg-secondary relative">
            <Bell className="size-3.5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive" />
          </button>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function SidebarGroup({
  group,
  pathname,
  search,
}: {
  group: Group;
  pathname: string;
  search: Record<string, unknown>;
}) {
  const [open, setOpen] = useState(group.defaultOpen ?? true);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-1 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/45 hover:text-sidebar-foreground/70"
      >
        <ChevronDown
          className={cn("size-3 transition-transform", !open && "-rotate-90")}
        />
        {group.label}
      </button>
      {open && (
        <div className="space-y-0.5 mt-0.5">
          {group.items.map((item) => {
            const Icon = item.icon;
            const pathMatches =
              (item.to === "/clusters" && pathname.startsWith("/cluster")) ||
              (item.to === pathname);
            let active = false;
            if (pathMatches) {
              if (item.search) {
                active = Object.entries(item.search).every(
                  ([k, v]) => String(search?.[k] ?? "") === v,
                );
              } else {
                // plain link (no search): active only when no relevant filter is set
                const hasFilter =
                  (item.to === "/" && search?.filter) ||
                  (item.to === "/board" && search?.lane);
                active = !hasFilter && (
                  (item.to === "/" && item.label === "Inbox") ||
                  (item.to === "/board" && group.label === "Workspace") ||
                  item.to === "/clusters" ||
                  item.to === "/resolve"
                );
              }
            }
            return (
              <Link
                key={item.label}
                to={item.to}
                search={item.search as never}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors group",
                  active
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-white",
                )}
              >
                {Icon && <Icon className={cn("size-3.5 shrink-0", item.tone)} />}
                <span className="flex-1 truncate">{item.label}</span>
                {item.count != null && (
                  <span
                    className={cn(
                      "text-[10px] tabular-nums px-1.5 py-0.5 rounded",
                      active
                        ? "bg-white/15 text-white"
                        : "bg-sidebar-accent/60 text-sidebar-foreground/70 group-hover:bg-sidebar-accent",
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
