import { Cohort } from "@/types";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface CohortSelectorProps {
  cohorts: Cohort[];
  selectedCohort: Cohort | null;
  onSelectCohort: (cohort: Cohort) => void;
}

export const CohortSelector = ({
  cohorts,
  selectedCohort,
  onSelectCohort,
}: CohortSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {cohorts.map((cohort) => (
        <Button
          key={cohort.id}
          variant={selectedCohort?.id === cohort.id ? "default" : "outline"}
          onClick={() => onSelectCohort(cohort)}
          className={`
            ${
              selectedCohort?.id === cohort.id
                ? "bg-primary hover:bg-primary-light text-primary-foreground neon-glow-blue border-primary"
                : "bg-card border-primary/30 text-foreground hover:border-primary/60 hover:bg-card"
            }
            transition-all duration-300 font-bold
          `}
        >
          <Users className="w-4 h-4 mr-2" />
          {cohort.name}
        </Button>
      ))}
    </div>
  );
};
