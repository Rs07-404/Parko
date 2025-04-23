import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"
import { IReservation } from "@/interfaces/Generic/IReservation";
// Define the status types and their corresponding colors
const statusConfig = {
  Booked: { label: "Booked", color: "text-amber-500" },
  Entered: { label: "Entered", color: "text-green-500" },
  Completed: { label: "Completed", color: "text-blue-500" },
  Canceled: { label: "Canceled", color: "text-red-500" },
}


export function TicketCard({ reservation }: { reservation: IReservation }) {
  const { parkingAreaId, parkingSpots, ticketKey, bookingTime, entryTime, exitTime, status } = reservation

  // Format dates for display with fallback
  const formattedBookingDate = bookingTime ? format(new Date(bookingTime), "MMM dd, yyyy") : "Not specified"
  const formattedBookingTime = bookingTime ? format(new Date(bookingTime), "h:mm a") : "Not specified"

  // Get status configuration with fallback
  const statusInfo = status ? (statusConfig[status] || { label: "Unknown", color: "text-gray-500" }) : { label: "Not specified", color: "text-gray-500" }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-pink-100 to-purple-200 dark:from-[rgba(255,0,128,0.1)] dark:to-[rgba(128,0,255,0.1)]
 text-foreground shadow-lg">
        {/* Top notches */}
        <div className="absolute left-0 top-27/40 h-5 w-5 -translate-x-1/2 rounded-full bg-card"></div>
        <div className="absolute right-0 top-27/40 h-5 w-5 translate-x-1/2 rounded-full bg-card"></div>

        {/* Header section */}
        <div className="p-6 py-4 text-center">
          <h3 className="text-xl font-bold tracking-wide uppercase">{parkingAreaId?.name || "Unknown Parking Area"}</h3>
          <div className="flex items-center justify-center text-sm opacity-90">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{parkingAreaId?.address || "Address not available"}</span>
          </div>
        </div>

        {/* Ticket ID/Number */}
        <div className="text-center">
          <p className="text-sm opacity-90">
            {ticketKey?._id ? ticketKey._id.substring(0, 8) : "No ID"}{" "}
          </p>
        </div>
        {/* QR Code section */}
        <div className="flex flex-col items-center justify-center p-2 mx-auto rounded-lg">
          {ticketKey?.qrcode ? (
            <>
              <div className="w-48 h-48 overflow-hidden rounded-lg" dangerouslySetInnerHTML={{ __html: ticketKey.qrcode }} />
              <p className="text-xs text-center mt-2">Scan this QR code at the parking entry</p>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-sm">QR code not available</p>
            </div>
          )}
        </div>

        {/* Dotted separator */}
        <div className="border-t border-dashed border-white/50 mx-4"></div>

        {/* Booking details */}
        <div className="px-6 py-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-xs font-medium opacity-80">BOOKING DATE & TIME</h4>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-2 opacity-80" />
                <div>
                  <p className="font-medium">{formattedBookingDate}</p>
                  <p className="text-sm opacity-80">{formattedBookingTime}</p>
                </div>
              </div>
            </div>
            <div className="text-sm opacity-90 flex flex-col gap-1">
            <p>{ticketKey?._id ? ticketKey._id.substring(0, 8) : "No ID"}{" "}</p>
            <Badge className={`bg-white ${statusInfo.color}`}>{statusInfo.label}</Badge>
          </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium opacity-80">ENTRY TIME</h4>
              <p className="mt-1 text-sm">{entryTime ? format(new Date(entryTime), "h:mm a, MMM dd") : "Not entered yet"}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium opacity-80">EXIT TIME</h4>
              <p className="mt-1 text-sm">
                {status === "Completed" && exitTime ? format(new Date(exitTime), "h:mm a, MMM dd") : "Not exited yet"}
              </p>
            </div>
          </div>

          {/* Spot information */}
          <div className="mt-4">
            <h4 className="text-xs font-medium opacity-80">SPOT</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {parkingSpots && parkingSpots.length > 0 ? (
                parkingSpots.map((spot) => (
                  <Badge key={spot._id} variant="outline" className="border-card-foreground">
                    Spot {spot.spotNumber || "N/A"}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="border-card-foreground">
                  No spots assigned
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
