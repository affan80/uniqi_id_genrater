import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { QrCode, Users, Camera, X, Settings, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";

interface QRScanStepProps {
    teamId: string;
    onResetTeam: () => void;
}

interface CameraError extends Error {
    name: string;
    message: string;
}

export const QRScanStep: React.FC<QRScanStepProps> = ({
                                                          teamId,
                                                          onResetTeam
                                                      }) => {
    const [qrCode, setQrCode] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState("");
    const [permissionState, setPermissionState] = useState<"unknown" | "granted" | "denied" | "unsupported">("unknown");
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const { toast } = useToast();

    // Simplified camera support check
    useEffect(() => {
        const checkCameraSupport = () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setPermissionState("unsupported");
                return;
            }

            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    const videoDevices = devices.filter(device => device.kind === 'videoinput');
                    if (videoDevices.length === 0) {
                        setPermissionState("unsupported");
                    } else {
                        setPermissionState("unknown");
                    }
                })
                .catch(() => {
                    setPermissionState("unknown");
                });
        };

        checkCameraSupport();
    }, []);

    const startCamera = async () => {
        try {
            setCameraError("");
            setIsCameraActive(true);

            const constraints = {
                video: {
                    facingMode: "environment",
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 480, ideal: 720, max: 1080 }
                }
            };

            let stream: MediaProvider;
            try {
                stream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch (error) {
                console.log("Trying fallback camera constraints...");
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
            }

            streamRef.current = stream;
            setPermissionState("granted");

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

        } catch (error: unknown) {
            console.error("Camera error:", error);

            const cameraError = error as CameraError;

            if (cameraError.name === "NotAllowedError" || cameraError.name === "PermissionDeniedError") {
                setPermissionState("denied");
                setCameraError("Camera permission denied. Please enable camera access in your browser settings.");
                toast({
                    title: "Permission Required",
                    description: "Camera access is required to scan QR codes. Please enable camera permissions and try again.",
                    variant: "destructive",
                    duration: 5000,
                });
            } else {
                setPermissionState("unknown");
                setCameraError(`Camera error: ${cameraError.message || "Unable to access camera"}`);
                toast({
                    title: "Camera Error",
                    description: "There was a problem accessing your camera. Please try again or use manual input.",
                    variant: "destructive",
                    duration: 4000,
                });
            }

            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
        setCameraError("");
    };

    const handlePermissionSettings = () => {
        toast({
            title: "Enable Camera Access",
            description: (
                <div className="text-sm space-y-2">
                    <p>To enable camera permissions:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Look for a camera icon in your browser's address bar</li>
                        <li>Click it and select "Allow" for camera access</li>
                        <li>If you don't see the icon, check your browser settings</li>
                        <li>Refresh the page and try again</li>
                    </ul>
                </div>
            ),
            variant: "default",
            duration: 8000,
        });
    };

    const simulateQRDetection = () => {
        setIsScanning(true);

        setTimeout(() => {
            const simulatedQR = `LEVEL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
            setQrCode(simulatedQR);

            toast({
                title: "QR Code Detected!",
                description: `Code: ${simulatedQR}`,
            });

            validateQRCode(simulatedQR);
        }, 2000);
    };

    const validateQRCode = (code: string) => {
        const isValid = code.toUpperCase().includes("LEVEL");

        if (isValid) {
            toast({
                title: "✓ Level Completed!",
                description: "Your team has progressed to the next level.",
            });
        } else {
            toast({
                title: "✗ Invalid Code",
                description: "This QR code is not valid for your current level.",
                variant: "destructive",
            });
        }

        setIsScanning(false);
        stopCamera();
    };

    const handleManualQRSubmit = () => {
        if (!qrCode.trim()) {
            toast({
                title: "Error",
                description: "Please enter a QR code",
                variant: "destructive",
            });
            return;
        }
        validateQRCode(qrCode);
        setQrCode("");
    };

    // Clean up camera on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const shouldShowPermissionWarning = !isCameraActive &&
        (permissionState === "denied" || permissionState === "unsupported");

    return (
        <>
            {/* Team Info Banner */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Team: {teamId}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onResetTeam}
                        className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    >
                        Change Team
                    </Button>
                </div>
            </div>

            {/* Permission Status Card */}
            {shouldShowPermissionWarning && (
                <Card className="p-4 bg-muted/50 border border-muted-foreground/20">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-sm">
                                {permissionState === "denied"
                                    ? "Camera Permission Required"
                                    : "Camera Access Issue"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {permissionState === "denied"
                                    ? "Please enable camera access in your browser settings to scan QR codes."
                                    : "There seems to be an issue with camera access. You can still use manual input."}
                            </p>
                            {permissionState === "denied" && (
                                <Button
                                    onClick={handlePermissionSettings}
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 text-xs"
                                >
                                    <Settings className="w-3 h-3 mr-1" />
                                    How to Enable Camera
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {/* QR Scanner Display */}
            <div className="relative aspect-square max-w-xs mx-auto bg-near-black rounded-lg border-2 border-primary/40 overflow-hidden neon-glow-blue">
                {isCameraActive ? (
                    // Live Camera Feed
                    <>
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            playsInline
                        />
                        {isScanning && (
                            <div className="absolute inset-0 bg-primary/10">
                                <div className="absolute inset-x-0 h-1 bg-primary animate-pulse"
                                     style={{ animation: "scan 2s linear infinite" }} />
                            </div>
                        )}

                        {/* Camera Controls */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                            <Button
                                onClick={stopCamera}
                                variant="secondary"
                                size="sm"
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Stop Camera
                            </Button>
                        </div>
                    </>
                ) : (
                    // Static Scanner Display
                    <>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <QrCode className="w-24 h-24 text-primary/30" />
                        </div>

                        {cameraError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-red-500/10">
                                <div className="text-center text-red-400 text-sm p-4">
                                    {cameraError}
                                </div>
                            </div>
                        )}

                        {permissionState === "denied" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-red-500/5">
                                <div className="text-center text-red-400 text-sm p-4">
                                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                    <p>Camera access blocked</p>
                                    <p className="text-xs opacity-75">Check browser settings</p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Corner Brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary" />
            </div>

            {/* Scanner Controls */}
            <div className="space-y-3">
                {!isCameraActive ? (
                    // Camera Access Button
                    <div className="space-y-2">
                        <Button
                            onClick={startCamera}
                            disabled={isScanning || permissionState === "unsupported"}
                            className="w-full bg-primary hover:bg-primary-light text-primary-foreground font-bold neon-glow-blue"
                        >
                            <Camera className="w-4 h-4 mr-2" />
                            {permissionState === "denied" ? "Try Camera Again" : "Start Camera Scanner"}
                        </Button>

                        {permissionState === "denied" && (
                            <Button
                                onClick={handlePermissionSettings}
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                            >
                                <Settings className="w-3 h-3 mr-1" />
                                Camera Permission Help
                            </Button>
                        )}
                    </div>
                ) : (
                    // Simulate QR Detection Button (for demo)
                    <Button
                        onClick={simulateQRDetection}
                        disabled={isScanning}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                        {isScanning ? (
                            <>
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                Scanning...
                            </>
                        ) : (
                            <>
                                <QrCode className="w-4 h-4 mr-2" />
                                Simulate QR Detection
                            </>
                        )}
                    </Button>
                )}

                {/* Manual Input Fallback */}
                <div className="space-y-2 pt-4 border-t border-primary/20">
                    <div className="text-center text-sm text-muted-foreground terminal-text">
                        Or enter QR code manually
                    </div>
                    <Input
                        type="text"
                        placeholder="Enter QR code manually..."
                        value={qrCode}
                        onChange={(e) => setQrCode(e.target.value)}
                        className="bg-near-black border-primary/30 focus:border-primary text-foreground terminal-text"
                        disabled={isScanning || isCameraActive}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                handleManualQRSubmit();
                            }
                        }}
                    />
                    <Button
                        onClick={handleManualQRSubmit}
                        disabled={isScanning || isCameraActive || !qrCode.trim()}
                        variant="outline"
                        className="w-full border-primary/30 text-foreground"
                    >
                        Submit Manually
                    </Button>
                </div>
            </div>
        </>
    );
};