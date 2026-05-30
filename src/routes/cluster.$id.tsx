import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/StatusBadge";
import { toast } from "sonner";
import { Sparkles, Send, Edit3, Check, ArrowLeft, AlertOctagon, Layers, ArrowUpRight, Bookmark } from "lucide-react";
import { clusters } from "./clusters";

export const Route = createFileRoute("/cluster/$id")({
  head: () => ({ meta: [{ title: "Cluster · IssueFlow" }] }),
  component: ClusterDetailPage,
});

const memberSeed: Record<string, { id: string; customer: string; note: string }[]> = {
  "C-201": [
    { id: "A-1009-1", customer: "Rina Putri", note: "Parent ticket also has login + refund sub-issues." },
    { id: "A-1011", customer: "Sofia Alvarez", note: "Single-issue ticket — no demux needed." },
    { id: "A-1012", customer: "Daniel Park", note: "Single-issue ticket — no demux needed." },
    { id: "A-1018-2", customer: "Yuki Tanaka", note: "Sub-issue from multi-issue ticket A-1018." },
  ],
  "C-184": [
    { id: "A-1009-2", customer: "Rina Putri", note: "Sub-issue from parent A-1009." },
    { id: "A-1013", customer: "Aisha Rahman", note: "Single-issue ticket." },
    { id: "A-1020", customer: "Tom Becker", note: "Single-issue ticket." },
  ],
  "C-176": [
    { id: "A-1009-3", customer: "Rina Putri", note: "Sub-issue from parent A-1009." },
    { id: "A-1010", customer: "Marcus Chen", note: "Single-issue ticket." },
    { id: "A-1015-2", customer: "Priya Shah", note: "Sub-issue from A-1015." },
  ],
};

const baseReplies: Record<string, string> = {
  "C-201":
    "Hi {{name}}, we've detected an issue syncing recent payments with our order system. Your transaction was captured successfully — our engineering team is restoring the affected orders now. We'll confirm your order details within 2 hours. No action needed from your side.",
  "C-184":
    "Hi {{name}}, after a password reset our system can take a few minutes to refresh your session. Please sign out fully and try again. If it still fails, reply here and we'll verify your account manually.",
  "C-176":
    "Hi {{name}}, your refund is being processed. Funds typically appear within 3–5 business days depending on your bank. We'll email a confirmation as soon as it clears on our end.",
};

function ClusterDetailPage() {
  const { id } = Route.useParams();
  const cluster = clusters.find((c) => c.id === id);
  const members = memberSeed[id] ?? [];
  const [base, setBase] = useState(baseReplies[id] ?? "");
  const [editingBase, setEditingBase] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalSent = useMemo(() => Object.values(sent).filter(Boolean).length, [sent]);

  if (!cluster) {
    return (
      <AppLayout breadcrumb={[{ label: "Clusters", to: "/clusters" }, { label: id }]}>
        <div className="p-6">Cluster not found.</div>
      </AppLayout>
    );
  }

  const isSubTicket = (id: string) => /^A-\d+-\d+$/.test(id);
  const parentOf = (id: string) => id.replace(/-\d+$/, "");

  const broadcast = () => {
    const next: Record<string, boolean> = {};
    let subs = 0;
    let solo = 0;
    members.forEach((m) => {
      next[m.id] = true;
      if (isSubTicket(m.id)) subs++;
      else solo++;
    });
    setSent(next);
    toast.success(`Broadcast applied to ${members.length} tickets`, {
      description: `${solo} resolved · ${subs} saved to parent issue${subs === 1 ? "" : "s"}.`,
    });
  };

  return (
    <AppLayout
      breadcrumb={[{ label: "Clusters", to: "/clusters" }, { label: cluster.id }]}
    >
      <div className="p-6 max-w-5xl space-y-5">
        <div>
          <h1 className="text-xl font-semibold">{cluster.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
            <span className="font-mono">{cluster.id}</span>
            <span>·</span>
            <span>{cluster.count} reports</span>
            <span>·</span>
            <span>{cluster.team}</span>
            {cluster.severity === "Critical" && (
              <Badge className="ml-1 bg-destructive/10 text-destructive border-destructive/20">
                <AlertOctagon className="size-3" /> Critical
              </Badge>
            )}
          </p>
        </div>


        {/* Cluster reply */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b bg-navy text-white flex items-center gap-2">
            <Sparkles className="size-4 text-accent" />
            <span className="text-sm font-medium">Cluster reply</span>
            <span className="ml-auto text-[11px] text-white/60">
              Applies to {members.length} tickets · {`{{name}}`} fills per recipient
            </span>
          </div>
          <div className="p-4 space-y-3">
            {editingBase ? (
              <textarea
                value={base}
                onChange={(e) => setBase(e.target.value)}
                rows={5}
                className="w-full text-sm leading-relaxed bg-secondary/30 border rounded-md p-3 outline-none focus:border-accent"
              />
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-line">{base}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={broadcast}
                className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90"
              >
                <Send className="size-3.5" /> Apply to all ({members.length})
              </button>
              <button
                onClick={() => setEditingBase((e) => !e)}
                className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md bg-secondary text-xs hover:bg-secondary/70"
              >
                <Edit3 className="size-3.5" /> {editingBase ? "Done" : "Edit base"}
              </button>
              {totalSent > 0 && (
                <span className="text-xs text-success inline-flex items-center gap-1 self-center">
                  <Check className="size-3.5" /> Processed {totalSent}/{members.length}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground pt-1 border-t mt-1">
              <span className="inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-accent" /> Standalone ticket → sending resolves it
              </span>
              <span className="inline-flex items-center gap-1">
                <Layers className="size-3 text-info" /> Sub-issue → saved to parent's resolution
              </span>
            </div>
          </div>
        </div>

        {/* Members with per-ticket override */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b text-sm font-medium">
            Member tickets <span className="text-muted-foreground font-normal">· tweak any before applying</span>
          </div>
          <div className="divide-y">
            {members.map((m) => {
              const isOpen = expanded === m.id;
              const draft = overrides[m.id] ?? base.replace("{{name}}", m.customer.split(" ")[0]);
              const isSent = sent[m.id];
              const hasOverride = overrides[m.id] != null;
              const isSub = isSubTicket(m.id);
              const parentId = parentOf(m.id);
              return (
                <div key={m.id} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground">{m.id}</span>
                        <span className="text-sm font-medium">{m.customer}</span>
                        {isSub ? (
                          <Badge className="bg-info/10 text-info border-info/20">
                            <Layers className="size-3" /> Sub-issue of {parentId}
                          </Badge>
                        ) : (
                          <Badge className="bg-accent/10 text-accent border-accent/20">Standalone</Badge>
                        )}
                        {hasOverride && (
                          <Badge className="bg-warning/15 text-warning border-warning/30">Custom</Badge>
                        )}
                        {isSent && (
                          <Badge variant="Resolved">{isSub ? "Saved" : "Resolved"}</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{m.note}</div>
                    </div>
                    <button
                      onClick={() => setExpanded(isOpen ? null : m.id)}
                      className="text-xs px-2.5 h-7 rounded-md bg-secondary hover:bg-secondary/70"
                    >
                      {isOpen ? "Close" : "Tweak"}
                    </button>
                    {isSent ? (
                      isSub ? (
                        <Link
                          to="/resolve"
                          className="text-xs px-2.5 h-7 rounded-md bg-info/10 text-info border border-info/20 hover:bg-info/15 inline-flex items-center gap-1"
                        >
                          Open {parentId} <ArrowUpRight className="size-3" />
                        </Link>
                      ) : (
                        <span className="text-xs px-2.5 h-7 rounded-md bg-success/10 text-success border border-success/20 inline-flex items-center gap-1">
                          <Check className="size-3" /> Resolved
                        </span>
                      )
                    ) : (
                      <button
                        onClick={() => {
                          setSent((s) => ({ ...s, [m.id]: true }));
                          if (isSub) {
                            toast.success(`Saved to ${parentId}`, {
                              description: `Reply queued in ${parentId}'s resolution. Will be combined with other sub-issues.`,
                            });
                          } else {
                            toast.success(`Reply sent · ${m.id} resolved`, {
                              description: `${m.customer} has been notified.`,
                            });
                          }
                        }}
                        className="text-xs px-2.5 h-7 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        {isSub ? (
                          <>
                            <Bookmark className="size-3" /> Save to {parentId}
                          </>
                        ) : (
                          <>
                            <Send className="size-3" /> Send & resolve
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {isOpen && (
                    <div className="mt-3 pl-0">
                      <textarea
                        value={draft}
                        onChange={(e) => setOverrides((o) => ({ ...o, [m.id]: e.target.value }))}
                        rows={4}
                        className="w-full text-sm leading-relaxed bg-secondary/30 border rounded-md p-3 outline-none focus:border-accent"
                      />
                      {hasOverride && (
                        <button
                          onClick={() =>
                            setOverrides((o) => {
                              const n = { ...o };
                              delete n[m.id];
                              return n;
                            })
                          }
                          className="mt-2 text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          Reset to cluster base
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Standalone tickets are resolved the moment you send the cluster reply. Sub-issues are saved to
          their parent's <Link to="/resolve" className="text-accent hover:underline">resolution page</Link>,
          where all sub-replies are combined into one message before the customer is notified.
        </p>
      </div>
    </AppLayout>
  );
}
