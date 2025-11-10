import { Team } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target } from "lucide-react";
import { TOTAL_LEVELS } from "@/data/mockData";

interface TeamCardProps {
  team: Team;
  rank?: number;
}

export const TeamCard = ({ team, rank }: TeamCardProps) => {
  const progress = (team.currentLevel / TOTAL_LEVELS) * 100;
  const completedCount = team.completedLevels?.length || 0;

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 bg-card hover:border-primary/60 transition-all duration-300 group">
      {/* Rank Badge */}
      {rank && rank <= 3 && (
        <div className="absolute top-4 right-4 z-10">
          <Badge
            variant="outline"
            className={`
              ${rank === 1 ? "bg-success/20 border-success text-success neon-glow-green" : ""}
              ${rank === 2 ? "bg-secondary/20 border-secondary text-secondary neon-glow-cyan" : ""}
              ${rank === 3 ? "bg-accent/20 border-accent text-accent neon-glow-purple" : ""}
              font-bold text-lg px-3 py-1
            `}
          >
            <Trophy className="w-4 h-4 mr-1 inline" />
            #{rank}
          </Badge>
        </div>
      )}

      <div className="p-6">
        {/* Team Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center neon-glow-blue">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {team.name}
            </h3>
            <p className="text-sm text-muted-foreground terminal-text">
              {team.cohort?.name}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-bold text-primary terminal-text">
              Level {team.currentLevel}/{TOTAL_LEVELS}
            </span>
          </div>
          <div className="relative h-3 bg-near-black rounded-full overflow-hidden border border-primary/20">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-success transition-all duration-500 neon-glow-blue"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          </div>
          <div className="text-xs text-muted-foreground text-right terminal-text">
            {completedCount} levels completed
          </div>
        </div>

        {/* Level Indicators */}
        <div className="mt-4 flex gap-1 flex-wrap">
          {Array.from({ length: TOTAL_LEVELS }).map((_, i) => (
            <div
              key={i}
              className={`
                w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-bold transition-all duration-300
                ${
                  i < team.currentLevel
                    ? "border-success bg-success/20 text-success neon-glow-green"
                    : i === team.currentLevel
                    ? "border-primary bg-primary/20 text-primary pulse-glow animate-pulse"
                    : "border-muted/30 bg-muted/10 text-muted-foreground"
                }
              `}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Cyber Border Effect */}
      <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/40 rounded-lg transition-all duration-300 pointer-events-none" />
    </Card>
  );
};
