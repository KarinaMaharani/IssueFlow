import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/StatusBadge";
import { Sparkles, Split, ArrowRight, Layers } from "lucide-react";

export const Route = createFileRoute("/ticket")({
  head: () => ({ meta: [{ title: "Ticket A-1009 · IssueFlow" }] }),
  component: TicketDetailPage,
});

function TicketDetailPage() {
  return (
    <AppLayout
      breadcrumb={[{ label: "Inbox", to: "/" }, { label: "A-1009" }]}
    >
      <div className="p-6 max-w-3xl space-y-4">
        <div className="bg-card border rounded-lg p-5">
          <div className="text-xs text-muted-foreground font-mono">A-1009 · Rina Putri · Chat</div>
          <h1 className="text-lg font-semibold mt-1">Paid order missing, login blocked, refund inquiry</h1>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <Badge variant="High">High</Badge>
            <Badge variant="Frustrated">Frustrated</Badge>
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <Sparkles className="size-3" /> 3 issues detected
            </Badge>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground border-l-2 border-border pl-3">
            "I already paid, but my order has not appeared. I also cannot log in to check the order status,
            and I want to know whether I can get a refund."
          </p>
        </div>

        <div className="border border-accent/30 bg-accent/[0.04] rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-accent" /> AI suggests demux
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            Three independent intents (payment, account, refund) detected. Splitting routes each to the
            right team in parallel — recombined into one customer reply when all sub-issues are resolved.
          </p>
          <div className="flex gap-2 mt-3">
            <Link
              to="/demux"
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90"
            >
              <Split className="size-3.5" /> Open demux view
            </Link>
            <Link
              to="/resolve"
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md bg-secondary text-xs hover:bg-secondary/70"
            >
              Skip — resolve as single ticket
            </Link>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 flex items-start gap-3">
          <Layers className="size-4 text-info mt-0.5 shrink-0" />
          <div className="text-xs flex-1">
            <div className="font-medium">Note · Single-issue tickets skip demux</div>
            <p className="text-muted-foreground mt-0.5">
              Tickets with one intent (e.g. <span className="font-mono">A-1011</span>) go straight to
              resolution, but can still join an issue cluster if similar reports exist.
            </p>
          </div>
          <Link to="/clusters" className="text-xs text-accent hover:underline whitespace-nowrap inline-flex items-center gap-1">
            See clusters <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
