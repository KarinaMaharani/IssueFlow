import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/StatusBadge";
import { toast } from "sonner";
import { Sparkles, CreditCard, KeyRound, Wallet, CheckCircle2, ArrowRight, Layers } from "lucide-react";

export const Route = createFileRoute("/demux")({
  head: () => ({ meta: [{ title: "Demux · A-1009" }] }),
  component: DemuxPage,
});

const lanes = [
  {
    key: "payment",
    title: "Payment",
    team: "Payment Ops",
    icon: CreditCard,
    accent: "text-accent",
    id: "A-1009-1",
    issue: "Payment completed but order not created",
    cluster: "C-201",
    priority: "High",
  },
  {
    key: "account",
    title: "Account",
    team: "Account Support",
    icon: KeyRound,
    accent: "text-info",
    id: "A-1009-2",
    issue: "Cannot log in to check order status",
    cluster: "C-184",
    priority: "Medium",
  },
  {
    key: "refund",
    title: "Refund",
    team: "Finance",
    icon: Wallet,
    accent: "text-warning",
    id: "A-1009-3",
    issue: "Asks whether refund is possible",
    cluster: "C-176",
    priority: "High",
  },
] as const;

function DemuxPage() {
  const navigate = useNavigate();
  return (
    <AppLayout
      breadcrumb={[
        { label: "Inbox", to: "/" },
        { label: "A-1009", to: "/ticket" },
        { label: "Demux" },
      ]}
    >
      <div className="p-6 max-w-5xl space-y-5">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-xs font-mono text-muted-foreground">PARENT · A-1009</div>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            "I already paid, but my order has not appeared. I also cannot log in… and I want to know whether I can get a refund."
          </p>
          <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <Sparkles className="size-3" /> 3 sub-issues
            </Badge>
            <button
              onClick={() => {
                toast.success("Split accepted · 3 sub-tickets created", {
                  description: "Routed in parallel. Reply will be combined when all are resolved.",
                });
                setTimeout(() => navigate({ to: "/resolve" }), 600);
              }}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90"
            >
              <CheckCircle2 className="size-3.5" /> Accept split
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {lanes.map((lane) => {
            const Icon = lane.icon;
            return (
              <div key={lane.key} className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Icon className={`size-4 ${lane.accent}`} />
                  <span className="text-sm font-semibold">{lane.title}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">→ {lane.team}</span>
                </div>
                <div className="mt-3 text-xs font-mono text-muted-foreground">{lane.id}</div>
                <div className="text-sm mt-0.5 leading-snug">{lane.issue}</div>
                <div className="mt-2 flex items-center gap-1.5">
                  <Badge variant={lane.priority as never}>{lane.priority}</Badge>
                  <Link
                    to="/clusters"
                    className="text-[10px] inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-info/10 text-info border border-info/20 hover:underline"
                  >
                    <Layers className="size-2.5" /> {lane.cluster}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Each sub-issue also joins its matching cluster (mux) for incident detection.
          </p>
          <Link to="/resolve" className="text-sm text-accent hover:underline inline-flex items-center gap-1">
            Continue to resolution <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
