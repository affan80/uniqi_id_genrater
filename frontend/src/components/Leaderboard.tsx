import { Team } from "@/types";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { TOTAL_LEVELS } from "@/data/mockData";

interface LeaderboardProps {
  teams: Team[];
}

export const Leaderboard = ({ teams }: LeaderboardProps) => {
  const sortedTeams = [...teams].sort((a, b) => b.currentLevel - a.currentLevel);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-success" />;
      case 2:
        return <Medal className="w-6 h-6 text-secondary" />;
      case 3:
        return <Award className="w-6 h-6 text-accent" />;
      default:
        return null;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-success/40 bg-success/5 neon-glow-green";
      case 2:
        return "border-secondary/40 bg-secondary/5 neon-glow-cyan";
      case 3:
        return "border-accent/40 bg-accent/5 neon-glow-purple";
      default:
        return "border-primary/20 bg-card hover:border-primary/40";
    }
  };

  return (
    <Card className="p-6 bg-card border-2 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center neon-glow-purple">
          <Trophy className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>
      </div>

      <div className="space-y-3">
        {sortedTeams.map((team, index) => {
          const rank = index + 1;
          const progress = (team.currentLevel / TOTAL_LEVELS) * 100;

          return (
            <div
              key={team.id}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-300
                ${getRankStyle(rank)}
              `}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-near-black border border-primary/30">
                  {rank <= 3 ? (
                    getRankIcon(rank)
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground terminal-text">
                      {rank}
                    </span>
                  )}
                </div>

                {/* Team Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-foreground truncate">
                      {team.name}
                    </h3>
                    <span className="text-sm font-bold text-primary terminal-text ml-2 whitespace-nowrap">
                      Level {team.currentLevel}
                    </span>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="relative h-2 bg-near-black rounded-full overflow-hidden border border-primary/20">
                    <div
                      className={`
                        absolute inset-y-0 left-0 transition-all duration-500
                        ${
                          rank === 1
                            ? "bg-success"
                            : rank === 2
                            ? "bg-secondary"
                            : rank === 3
                            ? "bg-accent"
                            : "bg-primary"
                        }
                      `}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Completed Levels Badge */}
                <div className="text-right">
                  <div className="text-xs text-muted-foreground terminal-text">
                    {team.completedLevels?.length || 0}/{TOTAL_LEVELS}
                  </div>
                  <div className="text-xs text-muted-foreground">completed</div>
                </div>
              </div>

              {/* Animated border for top 3 */}
              {rank <= 3 && (
                <div className="absolute inset-0 rounded-lg border-2 border-transparent animated-border pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
