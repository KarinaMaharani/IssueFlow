import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/StatusBadge";
import { Sparkles, AlertOctagon, ArrowRight, TrendingUp, Minus } from "lucide-react";

export const Route = createFileRoute("/clusters")({
  head: () => ({ meta: [{ title: "Clusters · IssueFlow" }] }),
  component: ClustersPage,
});

export const clusters = [
  {
    id: "C-201",
    name: "Payment deducted but order not created",
    related: ["A-1009-1", "A-1011", "A-1012", "A-1018-2"],
    count: 27,
    trend: "Rising",
    team: "Payment Engineering",
    severity: "Critical",
  },
  {
    id: "C-184",
    name: "Login failure after password reset",
    related: ["A-1009-2", "A-1013", "A-1020"],
    count: 8,
    trend: "Stable",
    team: "Account Support",
    severity: "Medium",
  },
  {
    id: "C-176",
    name: "Refund delay after failed order",
    related: ["A-1009-3", "A-1010", "A-1015-2"],
    count: 14,
    trend: "Rising",
    team: "Finance",
    severity: "High",
  },
];

function ClustersPage() {
  return (
    <AppLayout breadcrumb={[{ label: "Clusters" }]}>
      <div className="p-6 max-w-5xl space-y-5">
        <div>
          <h1 className="text-xl font-semibold">Issue clusters</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Similar sub-issues from across tickets — respond once, override per ticket if needed.
          </p>
        </div>

        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
          <AlertOctagon className="size-4 text-destructive mt-0.5 shrink-0" />
          <div className="flex-1 text-sm">
            <div className="font-medium">Possible incident · C-201</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              27 payment/order sync reports in the last 2 hours. Recommend escalation.
            </p>
          </div>
          <Link
            to="/cluster/$id"
            params={{ id: "C-201" }}
            className="text-xs font-medium text-destructive hover:underline whitespace-nowrap"
          >
            Open →
          </Link>
        </div>

        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b text-sm font-medium">Active clusters</div>
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-muted-foreground text-xs">
              <tr className="text-left">
                <th className="px-4 py-2 font-medium">Cluster</th>
                <th className="px-4 py-2 font-medium">Members</th>
                <th className="px-4 py-2 font-medium">Trend</th>
                <th className="px-4 py-2 font-medium">Team</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clusters.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5">
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-[11px] font-mono text-muted-foreground">{c.id}</div>
                  </td>
                  <td className="px-4 py-2.5 font-semibold tabular-nums">{c.count}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 text-xs ${c.trend === "Rising" ? "text-destructive" : "text-muted-foreground"}`}>
                      {c.trend === "Rising" ? <TrendingUp className="size-3" /> : <Minus className="size-3" />} {c.trend}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{c.team}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      to="/cluster/$id"
                      params={{ id: c.id }}
                      className="text-xs font-medium text-accent inline-flex items-center gap-1 hover:underline"
                    >
                      Open <ArrowRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="size-3 text-accent" />
          A cluster reply broadcasts to all members. Each ticket can be tweaked before send.
        </div>
      </div>
    </AppLayout>
  );
}
