import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/StatusBadge";
import { toast } from "sonner";
import { Sparkles, Check, Send, Lock, Unlock, Edit3, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/resolve")({
  head: () => ({ meta: [{ title: "Resolve · A-1009" }] }),
  component: ResolvePage,
});

type Sub = { id: string; label: string; cluster: string; resolution: string; resolved: boolean };

const initialSubs: Sub[] = [
  {
    id: "A-1009-1",
    label: "Payment / order sync",
    cluster: "C-201",
    resolution:
      "Your payment was captured. Engineering is restoring the affected orders — you'll receive a confirmation within 2 hours.",
    resolved: true,
  },
  {
    id: "A-1009-2",
    label: "Login after password reset",
    cluster: "C-184",
    resolution: "Please sign out fully and sign back in — sessions need a moment to refresh after reset.",
    resolved: true,
  },
  {
    id: "A-1009-3",
    label: "Refund eligibility",
    cluster: "C-176",
    resolution: "",
    resolved: false,
  },
];

function ResolvePage() {
  const [subs, setSubs] = useState(initialSubs);
  const [hold, setHold] = useState(true);
  const [sent, setSent] = useState(false);

  const allResolved = useMemo(() => subs.every((s) => s.resolved), [subs]);
  const canSend = !hold || allResolved;

  const combined = useMemo(() => {
    const parts = subs
      .filter((s) => s.resolved && s.resolution)
      .map((s, i) => `${i + 1}. ${s.resolution}`)
      .join("\n");
    return `Hi Rina, thanks for your patience. Here's an update on each of your concerns:\n\n${parts}\n\nLet us know if anything still feels off.`;
  }, [subs]);

  const updateSub = (id: string, patch: Partial<Sub>) =>
    setSubs((arr) => arr.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <AppLayout
      breadcrumb={[
        { label: "Inbox", to: "/" },
        { label: "A-1009", to: "/ticket" },
        { label: "Resolve" },
      ]}
    >
      <div className="p-6 max-w-5xl space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Resolve A-1009</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Parent ticket with 3 sub-issues. Reply is held until all sub-issues are resolved, then sent as one combined message.
            </p>
          </div>
          <button
            onClick={() => setHold((h) => !h)}
            className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-medium border ${
              hold
                ? "bg-warning/10 text-warning border-warning/30"
                : "bg-secondary border-border text-foreground"
            }`}
          >
            {hold ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
            {hold ? "Hold & combine" : "Send as ready"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Sub-issues */}
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b text-sm font-medium">Sub-issues</div>
            <div className="divide-y">
              {subs.map((s) => (
                <div key={s.id} className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateSub(s.id, { resolved: !s.resolved })}
                      className={`size-5 rounded grid place-items-center border ${
                        s.resolved
                          ? "bg-success border-success text-white"
                          : "bg-card border-border"
                      }`}
                    >
                      {s.resolved && <Check className="size-3" />}
                    </button>
                    <span className="text-xs font-mono text-muted-foreground">{s.id}</span>
                    <span className="text-sm font-medium">{s.label}</span>
                    <Link
                      to="/cluster/$id"
                      params={{ id: s.cluster }}
                      className="ml-auto text-[11px] text-info hover:underline font-mono"
                    >
                      {s.cluster}
                    </Link>
                  </div>
                  <textarea
                    value={s.resolution}
                    onChange={(e) => updateSub(s.id, { resolution: e.target.value })}
                    rows={2}
                    placeholder={s.resolved ? "Reply for this sub-issue…" : "Pending — resolve to include in combined reply."}
                    className="w-full text-xs leading-relaxed bg-secondary/30 border rounded-md p-2 outline-none focus:border-accent disabled:opacity-50"
                    disabled={!s.resolved}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Combined reply */}
          <div className="bg-card border rounded-lg overflow-hidden h-fit">
            <div className="px-4 py-2.5 border-b bg-navy text-white flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <span className="text-sm font-medium">Combined customer reply</span>
            </div>
            <div className="p-4 space-y-3">
              <div
                className={`text-xs px-3 py-2 rounded-md border flex items-center gap-2 ${
                  canSend
                    ? "bg-success/10 border-success/30 text-success"
                    : "bg-warning/10 border-warning/30 text-warning"
                }`}
              >
                {canSend ? <Check className="size-3.5" /> : <Lock className="size-3.5" />}
                {canSend
                  ? "All sub-issues resolved — ready to send."
                  : `Holding · ${subs.filter((s) => !s.resolved).length} sub-issue(s) still pending`}
              </div>

              <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans bg-secondary/20 border rounded-md p-3 max-h-72 overflow-auto">
                {combined}
              </pre>

              <div className="flex flex-wrap gap-2">
                <button
                  disabled={!canSend || sent}
                  onClick={() => {
                    setSent(true);
                    toast.success("Combined reply sent to Rina Putri", {
                      description: "All 3 sub-issues delivered as one message.",
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="size-3.5" /> {sent ? "Sent" : "Send combined reply"}
                </button>
                <button
                  onClick={() => toast("Draft saved")}
                  className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md bg-secondary text-xs hover:bg-secondary/70"
                >
                  <Edit3 className="size-3.5" /> Save draft
                </button>
              </div>

              {sent && (
                <Link to="/" className="text-xs text-accent hover:underline inline-flex items-center gap-1">
                  Back to inbox <ArrowRight className="size-3" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-secondary/40 border rounded-md px-3 py-2 leading-relaxed">
          <span className="font-medium text-foreground">How it works:</span> Each sub-issue is worked
          independently (often by different teams) and joins its cluster for incident detection. The
          parent reply stays <span className="font-medium">held</span> until every sub-issue is resolved,
          then sends as one combined message. Single-issue tickets skip this — they resolve directly,
          but still contribute to their cluster.
        </div>
      </div>
    </AppLayout>
  );
}
