import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/StatusBadge";
import {
  CreditCard,
  KeyRound,
  Wallet,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronRight,
  Lock,
  MessageSquare,
  ArrowRight,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/board")({
  head: () => ({ meta: [{ title: "Board · IssueFlow" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    lane: (typeof s.lane === "string" &&
      ["all", "payment", "account", "finance", "general"].includes(s.lane)
      ? s.lane
      : "all") as "all" | LaneKey,
  }),
  component: BoardPage,
});

type Card = {
  id: string;
  customer: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  lane: LaneKey;
  cluster?: string;
  status: "Triage" | "In Progress" | "Waiting" | "Resolved";
  parentId?: string; // sub-issue link to parent
};

type LaneKey = "payment" | "account" | "finance" | "general";

const laneMeta: Record<LaneKey, { label: string; icon: any; accent: string; bar: string }> = {
  payment: { label: "Payment Ops", icon: CreditCard, accent: "text-accent", bar: "bg-accent" },
  account: { label: "Account Support", icon: KeyRound, accent: "text-info", bar: "bg-info" },
  finance: { label: "Finance", icon: Wallet, accent: "text-warning", bar: "bg-warning" },
  general: { label: "General", icon: HelpCircle, accent: "text-muted-foreground", bar: "bg-muted-foreground/60" },
};

// Parent multi-issue tickets (umbrella) — their sub-issues live in lanes
type Parent = {
  id: string;
  customer: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  subs: { id: string; lane: LaneKey; title: string; status: Card["status"] }[];
};

const parents: Parent[] = [
  {
    id: "A-1009",
    customer: "Rina Putri",
    title: "Paid order missing, login blocked, refund inquiry",
    priority: "High",
    subs: [
      { id: "A-1009-1", lane: "payment", title: "Payment captured but no order created", status: "In Progress" },
      { id: "A-1009-2", lane: "account", title: "Cannot log in after reset", status: "Resolved" },
      { id: "A-1009-3", lane: "finance", title: "Refund eligibility question", status: "Waiting" },
    ],
  },
  {
    id: "A-1018",
    customer: "Yuki Tanaka",
    title: "Wrong charge + missing invoice",
    priority: "Medium",
    subs: [
      { id: "A-1018-1", lane: "finance", title: "Double charge on subscription", status: "In Progress" },
      { id: "A-1018-2", lane: "payment", title: "Order webhook never fired", status: "Triage" },
    ],
  },
];

// Standalone single-issue tickets per lane
const singles: Card[] = [
  { id: "A-1011", customer: "Sofia Alvarez", title: "Payment deducted, order failed", priority: "High", lane: "payment", cluster: "C-201", status: "Triage" },
  { id: "A-1012", customer: "Daniel Park", title: "Payment success, order pending", priority: "High", lane: "payment", cluster: "C-201", status: "Triage" },
  { id: "A-1013", customer: "Aisha Rahman", title: "Locked out after password reset", priority: "Medium", lane: "account", cluster: "C-184", status: "In Progress" },
  { id: "A-1020", customer: "Tom Becker", title: "OTP email not arriving", priority: "Low", lane: "account", status: "Triage" },
  { id: "A-1010", customer: "Marcus Chen", title: "Refund not received yet", priority: "Medium", lane: "finance", cluster: "C-176", status: "Waiting" },
  { id: "A-1022", customer: "Lena Ortiz", title: "Need invoice for Q2", priority: "Low", lane: "finance", status: "Resolved" },
  { id: "A-1024", customer: "Ben Cole", title: "How to change plan?", priority: "Low", lane: "general", status: "Triage" },
  { id: "A-1025", customer: "Maya Sun", title: "Mobile app crash on iOS", priority: "Medium", lane: "general", status: "In Progress" },
];

const statuses: Card["status"][] = ["Triage", "In Progress", "Waiting", "Resolved"];

function BoardPage() {
  const [groupBy, setGroupBy] = useState<"lane" | "status">("lane");
  const { lane } = Route.useSearch() as { lane: "all" | LaneKey };

  const visibleLanes = (Object.keys(laneMeta) as LaneKey[]).filter(
    (k) => lane === "all" || k === lane,
  );
  const visibleParents = parents
    .map((p) => ({
      ...p,
      subs: lane === "all" ? p.subs : p.subs.filter((s) => s.lane === lane),
    }))
    .filter((p) => p.subs.length > 0);

  return (
    <AppLayout breadcrumb={[{ label: "Workspace" }, { label: "Board" }]}>
      <div className="p-6 space-y-5">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold">Issue Board</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Multi-issue tickets appear as umbrellas; their sub-issues live in team lanes and stay
              <span className="font-medium text-warning"> held</span> until the parent is fully resolved.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {lane !== "all" ? (
              <Link
                to="/board"
                search={{ lane: "all" }}
                className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md bg-accent/10 text-accent border border-accent/20 hover:bg-accent/15"
              >
                <Filter className="size-3.5" /> {laneMeta[lane].label}
                <span className="ml-1 text-muted-foreground">×</span>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md bg-secondary text-muted-foreground">
                <Filter className="size-3.5" /> All teams
              </span>
            )}
            <div className="inline-flex rounded-md bg-secondary p-0.5">
              {(["lane", "status"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGroupBy(g)}
                  className={`px-2.5 h-7 rounded text-xs capitalize ${
                    groupBy === g ? "bg-card shadow-sm font-medium" : "text-muted-foreground"
                  }`}
                >
                  By {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Umbrella row */}
        {visibleParents.length > 0 && (
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-1">
              Multi-issue parents · held until all sub-issues resolved
              {lane !== "all" && ` · filtered to ${laneMeta[lane].label}`}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visibleParents.map((p) => (
                <UmbrellaCard key={p.id} parent={p} />
              ))}
            </div>
          </div>
        )}

        {/* Lanes / Status board */}
        {groupBy === "lane" ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${visibleLanes.length > 2 ? "xl:grid-cols-4" : ""}`}>
            {visibleLanes.map((laneKey) => (
              <LaneColumn key={laneKey} laneKey={laneKey} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {statuses.map((st) => (
              <StatusColumn key={st} status={st} laneFilter={lane} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function UmbrellaCard({ parent }: { parent: Parent }) {
  const [open, setOpen] = useState(true);
  const resolved = parent.subs.filter((s) => s.status === "Resolved").length;
  const total = parent.subs.length;
  const allDone = resolved === total;
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="px-3 py-2.5 border-b flex items-center gap-2 bg-gradient-to-r from-accent/[0.06] to-transparent">
        <Layers className="size-3.5 text-accent" />
        <span className="text-xs font-mono text-muted-foreground">{parent.id}</span>
        <span className="text-sm font-medium truncate">{parent.title}</span>
        <Badge variant={parent.priority} className="ml-auto">{parent.priority}</Badge>
      </div>
      <div className="px-3 py-2 flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">{parent.customer}</span>
        <span className="text-muted-foreground/50">·</span>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="tabular-nums">{resolved}/{total}</span> resolved
        </div>
        <div
          className={`ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
            allDone
              ? "bg-success/10 text-success border-success/20"
              : "bg-warning/10 text-warning border-warning/30"
          }`}
        >
          <Lock className="size-2.5" /> {allDone ? "Ready" : "Held"}
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-muted-foreground hover:text-foreground"
        >
          {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        </button>
      </div>
      {/* progress bar */}
      <div className="h-1 bg-muted">
        <div className="h-full bg-accent" style={{ width: `${(resolved / total) * 100}%` }} />
      </div>
      {open && (
        <div className="p-2.5 space-y-1.5">
          {parent.subs.map((s) => {
            const meta = laneMeta[s.lane];
            const Icon = meta.icon;
            return (
              <div
                key={s.id}
                className="flex items-center gap-2 px-2.5 py-2 rounded-md border bg-secondary/30 hover:bg-secondary/50"
              >
                <span className={`size-1.5 rounded-full ${meta.bar} shrink-0`} />
                <Icon className={`size-3.5 ${meta.accent} shrink-0`} />
                <span className="text-[11px] font-mono text-muted-foreground">{s.id}</span>
                <span className="text-xs truncate">{s.title}</span>
                <Badge variant={s.status as never} className="ml-auto">{s.status}</Badge>
              </div>
            );
          })}
          <div className="pt-1.5 flex justify-end">
            <Link
              to="/resolve"
              className="text-[11px] text-accent hover:underline inline-flex items-center gap-1"
            >
              <MessageSquare className="size-3" /> Combine & reply <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function LaneColumn({ laneKey }: { laneKey: LaneKey }) {
  const meta = laneMeta[laneKey];
  const Icon = meta.icon;
  const cards: (Card & { parentTitle?: string })[] = [
    ...parents.flatMap((p) =>
      p.subs
        .filter((s) => s.lane === laneKey)
        .map((s) => ({
          id: s.id,
          customer: p.customer,
          title: s.title,
          priority: p.priority,
          lane: laneKey,
          status: s.status,
          parentId: p.id,
          parentTitle: p.title,
        })),
    ),
    ...singles.filter((s) => s.lane === laneKey),
  ];

  return (
    <div className="rounded-lg border bg-muted/20 flex flex-col">
      <div className="px-3 py-2.5 border-b bg-card rounded-t-lg flex items-center gap-2">
        <div className={`size-1 h-6 rounded ${meta.bar}`} />
        <Icon className={`size-4 ${meta.accent}`} />
        <span className="text-sm font-semibold">{meta.label}</span>
        <span className="ml-auto text-[10px] tabular-nums px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
          {cards.length}
        </span>
      </div>
      <div className="p-2 space-y-2 min-h-[200px]">
        {cards.map((c) => (
          <BoardCard key={c.id} card={c} laneKey={laneKey} />
        ))}
        {cards.length === 0 && (
          <div className="text-[11px] text-muted-foreground italic text-center py-6">
            No cards
          </div>
        )}
      </div>
    </div>
  );
}

function StatusColumn({ status, laneFilter }: { status: Card["status"]; laneFilter: "all" | LaneKey }) {
  const all: (Card & { parentTitle?: string })[] = [
    ...parents.flatMap((p) =>
      p.subs.map((s) => ({
        id: s.id,
        customer: p.customer,
        title: s.title,
        priority: p.priority,
        lane: s.lane,
        status: s.status,
        parentId: p.id,
        parentTitle: p.title,
      })),
    ),
    ...singles,
  ].filter((c) => c.status === status && (laneFilter === "all" || c.lane === laneFilter));

  return (
    <div className="rounded-lg border bg-muted/20 flex flex-col">
      <div className="px-3 py-2.5 border-b bg-card rounded-t-lg flex items-center gap-2">
        <Badge variant={status as never}>{status}</Badge>
        <span className="ml-auto text-[10px] tabular-nums px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
          {all.length}
        </span>
      </div>
      <div className="p-2 space-y-2 min-h-[200px]">
        {all.map((c) => (
          <BoardCard key={c.id} card={c} laneKey={c.lane} />
        ))}
      </div>
    </div>
  );
}

function BoardCard({
  card,
  laneKey,
}: {
  card: Card & { parentTitle?: string };
  laneKey: LaneKey;
}) {
  const meta = laneMeta[laneKey];
  const isSub = !!card.parentId;
  return (
    <Link
      to={isSub ? "/resolve" : "/ticket"}
      className="block rounded-md border bg-card hover:shadow-sm hover:border-foreground/20 transition-all relative overflow-hidden"
    >
      {/* left lane bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${meta.bar}`} />
      <div className="p-2.5 pl-3 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground">{card.id}</span>
          {isSub && (
            <span className="inline-flex items-center gap-0.5 text-[9px] px-1 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
              <Layers className="size-2.5" /> {card.parentId}
            </span>
          )}
          <Badge variant={card.priority} className="ml-auto">{card.priority}</Badge>
        </div>
        <div className="text-[13px] leading-snug font-medium line-clamp-2">{card.title}</div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="truncate">{card.customer}</span>
          <span className="ml-auto flex items-center gap-1">
            {card.cluster && (
              <Link
                to="/cluster/$id"
                params={{ id: card.cluster }}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-info/10 text-info border border-info/20"
              >
                <Layers className="size-2.5" /> {card.cluster}
              </Link>
            )}
            <Badge variant={card.status as never}>{card.status}</Badge>
          </span>
        </div>
      </div>
    </Link>
  );
}
