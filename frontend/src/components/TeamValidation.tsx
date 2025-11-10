import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import React from "react";

interface TeamValidationProps {
    teamId: string;
    setTeamId: (id: string) => void;
    isScanning: boolean;
    onValidate: (teamId: string) => void;
}

export const TeamValidation: React.FC<TeamValidationProps> = ({
                                                                  teamId,
                                                                  setTeamId,
                                                                  isScanning,
                                                                  onValidate
                                                              }) => {
    const handleSubmit = () => {
        onValidate(teamId);
    };

    return (
        <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground terminal-text">
                Enter your team ID to start scanning
            </div>
            <Input
                type="text"
                placeholder="Enter team ID..."
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="bg-near-black border-primary/30 focus:border-primary text-foreground terminal-text"
                disabled={isScanning}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit();
                    }
                }}
            />
            <Button
                onClick={handleSubmit}
                disabled={isScanning}
                className="w-full bg-primary hover:bg-primary-light text-primary-foreground font-bold neon-glow-blue"
            >
                {isScanning ? (
                    <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Validating...
                    </>
                ) : (
                    <>
                        <Users className="w-4 h-4 mr-2" />
                        Validate Team
                    </>
                )}
            </Button>
        </div>
    );
};