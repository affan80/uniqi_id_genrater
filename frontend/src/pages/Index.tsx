import { useState } from "react";
import { TeamCard } from "@/components/TeamCard";
import { Leaderboard } from "@/components/Leaderboard";
import { QRScanner } from "@/components/QRScanner";
import { CohortSelector } from "@/components/CohortSelector";
import { StatsCard } from "@/components/StatsCard";
import { mockTeams, mockCohorts, TOTAL_LEVELS } from "@/data/mockData";
import { Cohort } from "@/types";
import { Users, Trophy, Target, Zap } from "lucide-react";

const Index = () => {
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(
    mockCohorts[0]
  );

  const filteredTeams = selectedCohort
    ? mockTeams.filter((team) => team.cohortId === selectedCohort.id)
    : mockTeams;

  const sortedTeams = [...filteredTeams].sort(
    (a, b) => b.currentLevel - a.currentLevel
  );

  const totalTeams = filteredTeams.length;
  const activeTeams = filteredTeams.filter((t) => t.currentLevel > 0).length;
  const averageProgress =
    filteredTeams.reduce((sum, team) => sum + team.currentLevel, 0) /
    totalTeams;
  const completionRate =
    (filteredTeams.filter((t) => t.currentLevel === TOTAL_LEVELS).length /
      totalTeams) *
    100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-primary/20 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center neon-glow-blue">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground glitch-hover">
                  CYBER QUEST
                </h1>
                <p className="text-sm text-muted-foreground terminal-text">
                  Team Challenge Tracker
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 terminal-text text-success">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse neon-glow-green" />
              <span className="text-sm font-bold">SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Cohort Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Select Cohort
          </h2>
          <CohortSelector
            cohorts={mockCohorts}
            selectedCohort={selectedCohort}
            onSelectCohort={setSelectedCohort}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Teams"
            value={totalTeams}
            icon={Users}
            iconColor="primary"
            subtitle="in cohort"
          />
          <StatsCard
            title="Active Teams"
            value={activeTeams}
            icon={Zap}
            iconColor="success"
            subtitle="currently playing"
          />
          <StatsCard
            title="Avg Progress"
            value={`Level ${averageProgress.toFixed(1)}`}
            icon={Target}
            iconColor="secondary"
            subtitle={`out of ${TOTAL_LEVELS}`}
          />
          <StatsCard
            title="Completion Rate"
            value={`${completionRate.toFixed(0)}%`}
            icon={Trophy}
            iconColor="accent"
            subtitle="teams finished"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teams Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center neon-glow-blue">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Teams</h2>
              <div className="ml-auto text-sm text-muted-foreground terminal-text">
                {filteredTeams.length} teams
              </div>
            </div>
            
            <div className="grid gap-4">
              {sortedTeams.map((team, index) => (
                <TeamCard key={team.id} team={team} rank={index + 1} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Scanner */}
            <QRScanner />

            {/*/!* Leaderboard *!/*/}
            {/*<Leaderboard teams={filteredTeams} />*/}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t-2 border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground terminal-text">
            <p>CYBER QUEST v2.0 | System Status: OPERATIONAL</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse delay-150" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
