"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import jsQR from "jsqr"

interface QrScannerProps {
    onQrDetected: (imageData: string) => void
}


export function QrScanner({ onQrDetected }: QrScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const startCamera = async () => {
        setCameraError(null)

        try {
            // First stop any existing camera
            await stopCamera()

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                    aspectRatio: 4 / 3
                },
            })

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                streamRef.current = stream;
                setIsScanning(true)
                startQrScanning()
            }
        } catch (error) {
            console.error("Error accessing camera:", error)
            setCameraError("Could not access camera. Please check permissions.")
            setIsScanning(false)
        }
    }

    const stopCamera = () => {
        return new Promise((resolve, reject) => {
        try {
            if (streamRef.current) {
                streamRef.current?.getTracks().forEach((track) => track.stop());
                streamRef.current?.getTracks().forEach((track) => track.dispatchEvent(new Event("stop")));
            }

            if (videoRef.current) {
                videoRef.current.pause()
                videoRef.current.srcObject = null
            }

            if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current)
                scanIntervalRef.current = null
            }
            
            setIsScanning(false);
            resolve(true);

        } catch (error) {
            console.error("Error stopping camera:", error)
            reject(false);
        }
    });
}
    


    const startQrScanning = () => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current)
        }

        scanIntervalRef.current = setInterval(() => {
            captureAndCheckForQr()
        }, 500) // Check for QR code every 500ms
    }

    const captureAndCheckForQr = () => {
        if (!videoRef.current || !canvasRef.current || !isScanning) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        if (!context || video.videoWidth === 0) return

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        // Get image data as base64
        const image = canvas.toDataURL("image/jpeg")

        // Send to parent for processing
        if (code) {
            onQrDetected(image)
        }
    }

    useEffect(() => {
        startCamera()

        return () => {
            stopCamera()
        }
    }, [])


    return (
        <div className="relative">
            {cameraError && (
                <div className="p-4 text-center bg-destructive/10 rounded-md text-destructive mb-4">{cameraError}</div>
            )}

            <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isScanning ? "block" : "hidden"}`}
                />

                {!isScanning && !cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <Camera className="w-16 h-16 text-muted-foreground opacity-50" />
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                <div className="absolute top-2 right-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={isScanning ? stopCamera : startCamera}
                        className="bg-background/80 backdrop-blur-sm"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
