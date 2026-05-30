import { cn } from "@/lib/utils";

const styles = {
  // priority
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Low: "bg-muted text-muted-foreground border-border",
  // sentiment
  Frustrated: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Angry: "bg-destructive/10 text-destructive border-destructive/20",
  Neutral: "bg-muted text-muted-foreground border-border",
  Negative: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Positive: "bg-success/10 text-success border-success/20",
  // status
  New: "bg-info/10 text-info border-info/20",
  Open: "bg-accent/10 text-accent border-accent/20",
  Triage: "bg-info/10 text-info border-info/20",
  "In Progress": "bg-accent/10 text-accent border-accent/20",
  Waiting: "bg-warning/15 text-warning border-warning/30",
  Escalated: "bg-destructive/10 text-destructive border-destructive/20",
  Resolved: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/15 text-warning border-warning/30",
  Rising: "bg-destructive/10 text-destructive border-destructive/20",
  Stable: "bg-muted text-muted-foreground border-border",
  Falling: "bg-success/10 text-success border-success/20",
} as const;

export function Badge({
  children,
  variant,
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  const v = variant && styles[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border",
        v || "bg-secondary text-secondary-foreground border-border",
        className,
      )}
    >
      {children}
    </span>
  );
}
