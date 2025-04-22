import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin } from "lucide-react"

// Define the status types and their corresponding colors
const statusConfig = {
  Booked: { label: "Booked", color: "bg-amber-500" },
  Entered: { label: "Entered", color: "bg-green-500" },
  Completed: { label: "Completed", color: "bg-blue-500" },
  Canceled: { label: "Canceled", color: "bg-red-500" },
}

// Type definitions for the reservation payload
interface ParkingArea {
  _id: string
  name: string
  address: string
}

interface ParkingSpot {
  spotId: string
  spotNumber: string
}

interface TicketKey {
  _id: string
  qrcode: string
}

interface Reservation {
  parkingAreaId: ParkingArea;
  parkingSpots: ParkingSpot[];
  ticketKey: TicketKey;
  bookingTime: string;
  entryTime?: string;
  exitTime?: string;
  status: "Booked" | "Entered" | "Completed" | "Canceled";
}

export function TicketCard({ reservation }: { reservation: Reservation }) {
  const { parkingAreaId, parkingSpots, ticketKey, bookingTime, entryTime, exitTime, status } = reservation

  // Format dates for display
  const formattedBookingDate = format(new Date(bookingTime), "MMM dd, yyyy")
  const formattedBookingTime = format(new Date(bookingTime), "h:mm a")

  // Get status configuration
  const statusInfo = statusConfig[status] || { label: "Unknown", color: "bg-gray-500" }

  return (
    <Card className="overflow-hidden transition-all p-0 duration-300 hover:shadow-lg w-full md:max-w-md mx-auto md:max-w-none">
      <CardHeader className={`${statusInfo.color} text-white p-4`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h3 className="text-lg font-bold">{parkingAreaId.name}</h3>
          <Badge variant="outline" className="text-white border-white self-start md:self-auto">
            Spot {parkingSpots.map((spot) => spot.spotNumber).join(", ")}
          </Badge>
        </div>
        <div className="flex items-center text-sm mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{parkingAreaId.address}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 md:flex-[50%] space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Booking Details</h4>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <div>
                  <p className="font-medium">{formattedBookingDate}</p>
                  <p className="text-sm text-gray-500">{formattedBookingTime}</p>
                </div>
              </div>
            </div>

            {entryTime && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Entry Time</h4>
                <p className="mt-1">{format(new Date(entryTime), "h:mm a, MMM dd")}</p>
              </div>
            )}

            {status === "Completed" && exitTime && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Exit Time</h4>
                <p className="mt-1">{format(new Date(exitTime), "h:mm a, MMM dd")}</p>
              </div>
            )}

            <div className="md:hidden">
              <Separator className="my-4" />
              <div className="flex flex-col items-center">
                <Badge className={`${statusInfo.color} mb-3`}>{statusInfo.label}</Badge>
                <div className="w-48 h-48 overflow-hidden rounded-lg" dangerouslySetInnerHTML={{ __html: ticketKey.qrcode }} />
                <p className="text-xs text-center mt-2 text-gray-500">Scan this QR code at the parking entrance</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex md:flex-[50%] md:flex-col md:items-center md:border-l md:border-gray-200 md:pl-4 md:ml-2">
            <Badge className={`${statusInfo.color} mb-3`}>{statusInfo.label}</Badge>
            <div className="w-48 h-48 overflow-hidden rounded-lg" dangerouslySetInnerHTML={{ __html: ticketKey.qrcode }} />
            <p className="text-xs text-center mt-2 text-gray-500">Scan this QR code at the parking entrance</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
