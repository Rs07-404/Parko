"use client";
import { TicketCard } from "@/components/Reservation/TicketCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAllReservations } from "@/hooks/use-reservationst";

// Sample reservation data

export default function Home() {
    const {reservations} = useAllReservations(); 
    return (
        <main className="container mx-auto p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">Your Parking Reservations</h1>

            <ScrollArea className="h-[calc(100vh-150px)] sm:pr-4 md:pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Example of different status tickets */}
                    {(reservations && reservations?.length > 0) ? reservations?.map((reservation) => (
                        <TicketCard
                            key={reservation._id}
                            reservation={reservation}
                        />
                    )):
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-500">
                        No reservations found.
                    </div>}
                    {/* <TicketCard
                        reservation={{
                            ...sampleReservation,
                            status: "Booked",
                            entryTime: undefined,
                            exitTime: undefined,
                        }}
                    />

                    <TicketCard
                        reservation={{
                            ...sampleReservation,
                            status: "Entered",
                            exitTime: undefined,
                        }}
                    />

                    <TicketCard
                        reservation={{
                            ...sampleReservation,
                            status: "Completed",
                        }}
                    />

                    <TicketCard
                        reservation={{
                            ...sampleReservation,
                            status: "Canceled",
                            entryTime: undefined,
                            exitTime: undefined,
                        }}
                    /> */}
                </div>
            </ScrollArea>
        </main>
    )
}
