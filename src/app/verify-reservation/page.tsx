"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { QrScanner } from "@/components/Reservation/QR-Scanner"
import { toast } from "sonner"
import { useAuthContext } from "@/context/auth-context"

export default function VerifyReservationsPage() {
  const [activeTab, setActiveTab] = useState("camera")
  const [barcodeValue, setBarcodeValue] = useState("")
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  const { authUser } = useAuthContext();

  // Focus the barcode input when the tab is selected and after any state changes
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }, [activeTab, barcodeValue])

  const handleQrDetected = async (qrData: { type: 'image' | 'key', value: string }) => {
    try {
      const response = await fetch(authUser?.roles[0] === "EntryOperator" ? "/api/reservation/verify-entry" : "/api/reservation/verify-exit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(qrData.type === 'image' ? { image: qrData.value } : { ticketKey: qrData.value }),
      })

      const responseData = await response.json()

      if (response.ok) {
        toast.success(responseData.message);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify QR code");
    }
  }

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!barcodeValue.trim()) {
      toast.error("Please enter a barcode value");
      return
    }

    try {
      const response = await fetch(authUser?.roles[0] === "EntryOperator" ? "/reservation/verify-entry" : "/reservation/verify-exit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketKey: barcodeValue }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

      // Clear the input - focus will be maintained by useEffect
      setBarcodeValue("")
    } catch (error) {
      console.error(error)
      toast.error("Failed to verify barcode");
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-4 max-w-3xl h-max flex flex-col">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">Verify Reservations</h1>

      <Card className="flex-1 bg-card">
        <CardContent className="p-4 sm:p-4">
          <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="camera">Camera Scanner</TabsTrigger>
              <TabsTrigger value="barcode">Barcode Scanner</TabsTrigger>
            </TabsList>

            <TabsContent value="camera" className="mt-0">
              <div className="space-y-2">
                <p className="text-center text-muted-foreground text-sm">
                  Position the QR code in front of your camera to scan
                </p>
                <div className="max-w-md mx-auto">
                  {activeTab === "camera" && (
                    <QrScanner onQrDetected={handleQrDetected} />
                  )}
                </div>
              </div>
            </TabsContent>


            <TabsContent value="barcode" className="mt-0">
              <form onSubmit={handleBarcodeSubmit} className="space-y-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <p className="text-center text-muted-foreground text-sm">Enter or scan the barcode value</p>
                  <Input
                    ref={barcodeInputRef}
                    type="text"
                    placeholder="Scan or enter barcode"
                    value={barcodeValue}
                    onChange={(e) => setBarcodeValue(e.target.value)}
                    className="text-center"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full">
                  Verify
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
