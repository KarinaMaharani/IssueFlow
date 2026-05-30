import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/StatusBadge";
import { Sparkles, Layers, ArrowRight, X, User, Flame, Lock } from "lucide-react";

type FilterKey = "all" | "mine" | "priority" | "multi" | "held";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inbox · IssueFlow" },
      { name: "description", content: "Agent-facing AI support console with ticket demux and mux." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    filter: (typeof s.filter === "string" &&
      ["all", "mine", "priority", "multi", "held"].includes(s.filter)
      ? s.filter
      : "all") as FilterKey,
  }),
  component: QueuePage,
});

const tickets = [
  { id: "A-1009", customer: "Rina Putri", preview: "Paid but order missing + cannot login + refund question", issues: 3, priority: "High", cluster: null, owner: "me", held: false, resolvedSubs: 2, displayAsDemux: true },
  { id: "A-1010", customer: "Marcus Chen", preview: "Refund has not been received", issues: 1, priority: "Medium", cluster: "C-176", owner: "other", held: false, resolvedSubs: 0 },
  { id: "A-1011", customer: "Sofia Alvarez", preview: "Payment deducted but order failed", issues: 1, priority: "High", cluster: "C-201", owner: "me", held: false, resolvedSubs: 0 },
  { id: "A-1012", customer: "Daniel Park", preview: "Payment success but order still pending", issues: 1, priority: "High", cluster: "C-201", owner: "other", held: false, resolvedSubs: 0 },
  { id: "A-1013", customer: "Aisha Rahman", preview: "Cannot access account after password reset", issues: 1, priority: "Medium", cluster: "C-184", owner: "other", held: false, resolvedSubs: 0 },
  { id: "A-1014", customer: "Liam O'Connor", preview: "Charged twice + missing invoice + want partial refund", issues: 3, priority: "High", cluster: null, owner: "me", held: true, resolvedSubs: 1 },
  { id: "A-1015", customer: "Yuki Tanaka", preview: "2FA reset + duplicate charge", issues: 2, priority: "Medium", cluster: null, owner: "other", held: true, resolvedSubs: 0 },
];

const filterMeta: Record<Exclude<FilterKey, "all">, { label: string; icon: any; tone: string }> = {
  mine: { label: "My tickets", icon: User, tone: "text-foreground" },
  priority: { label: "High priority", icon: Flame, tone: "text-destructive" },
  multi: { label: "Multi-issue", icon: Layers, tone: "text-accent" },
  held: { label: "Held replies", icon: Lock, tone: "text-warning" },
};

function openTarget(t: typeof tickets[number], filter: FilterKey) {
  if (t.held) return "/resolve" as const;
  if (filter === "multi" || t.issues > 1) return "/demux" as const;
  return "/ticket" as const;
}

function QueuePage() {
  const { filter } = Route.useSearch();

  const filtered = tickets.filter((t) => {
    if (filter === "mine") return t.owner === "me";
    if (filter === "priority") return t.priority === "High";
    if (filter === "multi") return t.issues > 1 && !t.held;
    if (filter === "held") return t.held;
    return true;
  });

  return (
    <AppLayout breadcrumb={[{ label: "Inbox" }]}>
      <div className="p-6 max-w-6xl space-y-5">
        <div>
          <h1 className="text-xl font-semibold">Inbox</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            IssueFlow splits multi-issue tickets and groups similar sub-issues into clusters.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Open tickets" value="124" />
          <Stat label="Multi-issue (demux)" value="37" accent />
          <Stat label="Active clusters" value="8" />
        </div>

        <div className="bg-card border rounded-lg">
          <div className="px-4 py-2.5 border-b flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">Tickets</div>
              {filter !== "all" && (
                <FilterChip filter={filter} />
              )}
            </div>
            <div className="text-[11px] text-muted-foreground tabular-nums">
              {filtered.length} of {tickets.length}
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-muted-foreground text-xs">
              <tr className="text-left">
                <th className="px-4 py-2 font-medium">Ticket</th>
                <th className="px-4 py-2 font-medium">Customer</th>
                <th className="px-4 py-2 font-medium">Message</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Priority</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5 font-mono text-xs">{t.id}</td>
                  <td className="px-4 py-2.5">{t.customer}</td>
                  <td className="px-4 py-2.5 text-muted-foreground max-w-sm truncate">{t.preview}</td>
                  <td className="px-4 py-2.5">
                    {t.held && !t.displayAsDemux ? (
                      <Badge className="bg-warning/10 text-warning border-warning/20">
                        <Lock className="size-3" /> Held · {t.resolvedSubs}/{t.issues}
                      </Badge>
                    ) : t.issues > 1 || t.displayAsDemux ? (
                      <Badge className="bg-accent/10 text-accent border-accent/20">
                        <Sparkles className="size-3" /> Demux · {t.issues}
                      </Badge>
                    ) : t.cluster ? (
                      <Badge className="bg-info/10 text-info border-info/20">
                        <Layers className="size-3" /> {t.cluster}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Single</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5"><Badge variant={t.priority as never}>{t.priority}</Badge></td>
                  <td className="px-4 py-2.5 text-right">
                    <Link to={openTarget(t, filter)} className="text-xs font-medium text-accent inline-flex items-center gap-1 hover:underline">
                      {openTarget(t, filter) === "/resolve" ? "Resume" : openTarget(t, filter) === "/demux" ? "Demux" : "Open"} <ArrowRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-xs text-muted-foreground italic">
                    No tickets match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground">
          Try <span className="font-mono">A-1009</span> (multi-issue → demux) or <span className="font-mono">A-1011</span> (single-issue → cluster only).
        </p>
      </div>
    </AppLayout>
  );
}

function FilterChip({ filter }: { filter: Exclude<FilterKey, "all"> }) {
  const meta = filterMeta[filter];
  const Icon = meta.icon;
  return (
    <Link
      to="/"
      search={{ filter: "all" }}
      className="inline-flex items-center gap-1 text-[11px] pl-1.5 pr-1 py-0.5 rounded-md border bg-secondary/50 hover:bg-secondary"
    >
      <Icon className={`size-3 ${meta.tone}`} />
      <span>{meta.label}</span>
      <X className="size-3 text-muted-foreground" />
    </Link>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-card border rounded-lg px-4 py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-xl font-semibold tabular-nums mt-0.5 ${accent ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}
