import { useState } from "react";
import { Card } from "@/components/ui/card";
import { QrCode, Users } from "lucide-react";
import { TeamValidation } from "./TeamValidation";
import { QRScanStep } from "./QRScanStep";
import { useToast } from "@/hooks/use-toast";

export const QRScanner = () => {
    const [teamId, setTeamId] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [isTeamValidated, setIsTeamValidated] = useState(false);
    const { toast } = useToast();

    const handleTeamValidation = (teamId: string) => {
        setIsScanning(true);

        // Simulate team ID validation
        setTimeout(() => {
            const isValid = teamId.toUpperCase().includes("TEAM");

            if (isValid) {
                setIsTeamValidated(true);
                toast({
                    title: "✓ Team Validated!",
                    description: "You can now scan QR codes.",
                });
            } else {
                toast({
                    title: "✗ Invalid Team ID",
                    description: "Please check your team ID and try again.",
                    variant: "destructive",
                });
            }

            setIsScanning(false);
        }, 1500);
    };

    const resetTeam = () => {
        setIsTeamValidated(false);
        setTeamId("");
    };

    return (
        <Card className="p-6 bg-card border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center neon-glow-blue">
                    {isTeamValidated ? (
                        <QrCode className="w-5 h-5 text-primary" />
                    ) : (
                        <Users className="w-5 h-5 text-primary" />
                    )}
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                    {isTeamValidated ? "Scan QR Code" : "Enter Team ID"}
                </h2>
            </div>

            <div className="space-y-4">
                {!isTeamValidated ? (
                    <TeamValidation
                        teamId={teamId}
                        setTeamId={setTeamId}
                        isScanning={isScanning}
                        onValidate={handleTeamValidation}
                    />
                ) : (
                    <QRScanStep
                        teamId={teamId}
                        onResetTeam={resetTeam}
                    />
                )}
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: calc(100% - 4px); }
                    100% { top: 0; }
                }
            `}</style>
        </Card>
    );
};