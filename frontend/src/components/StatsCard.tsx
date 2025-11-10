import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: "primary" | "secondary" | "success" | "accent";
  subtitle?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  subtitle,
}: StatsCardProps) => {
  const glowClass = {
    primary: "neon-glow-blue",
    secondary: "neon-glow-cyan",
    success: "neon-glow-green",
    accent: "neon-glow-purple",
  }[iconColor];

  const colorClass = {
    primary: "text-primary bg-primary/20 border-primary/40",
    secondary: "text-secondary bg-secondary/20 border-secondary/40",
    success: "text-success bg-success/20 border-success/40",
    accent: "text-accent bg-accent/20 border-accent/40",
  }[iconColor];

  return (
    <Card className="p-6 bg-card border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1 terminal-text">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground terminal-text">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg border flex items-center justify-center ${colorClass} ${glowClass}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};
